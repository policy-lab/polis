/** @jsx jsx */

import { RouteComponentProps, Link } from "react-router-dom"
import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Box, Grid, Heading, Button, Text, Flex, jsx } from "theme-ui"
import { TbExternalLink, TbUser, TbCheckbox } from "react-icons/tb"

import {
  populateConversationsStore,
  handleCreateConversationSubmit,
  handleCloseConversation,
  handleReopenConversation,
  populateConversationStatsStore,
} from "../actions"
import { DropdownMenu } from "../components/dropdown"

import Url from "../util/url"
import { RootState, Conversation } from "../util/types"
import ConversationRow from "../components/conversation_row"

class ManageConversations extends React.Component<
  {
    dispatch: Function
    error: Response
    loading: boolean
    conversations: Array<Conversation>
    conversation_stats: any
    history: any
  },
  {
    showArchived: boolean
    filterMinParticipantCount: number
    sort: string
  }
> {
  static propTypes: {
    dispatch: Function
    error: object
    loading: unknown
    conversations: unknown
    history: object
  }

  constructor(props) {
    super(props)
    this.state = {
      showArchived: false,
      filterMinParticipantCount: 0,
      sort: "participant_count",
    }
  }

  componentDidMount() {
    this.props.dispatch(populateConversationsStore())
    // loading true or just do that in constructor
    // check your connectivity and try again
  }

  filterCheck(c) {
    let include = true

    if (c.participant_count < this.state.filterMinParticipantCount) {
      include = false
    }

    if (this.props.history.pathname === "other-conversations") {
      // filter out conversations i do own
      include = !c.is_owner
    }

    if (this.props.history.pathname !== "other-conversations" && !c.is_owner) {
      // if it's not other convos and i'm not the owner, don't show it
      // filter out convos i don't own
      include = false
    }

    return include
  }

  firePopulateInboxAction() {
    this.props.dispatch(populateConversationsStore())
  }

  onFilterChange() {
    this.setState({ ...this.state })
  }

  render() {
    const err = this.props.error
    const { conversations, conversation_stats } = this.props

    return (
      <Box sx={{ mt: [4, null, 5], mb: [5] }}>
        <Flex>
          <Heading as="h1" sx={{ flex: 1, position: "relative", top: "4px" }}>
            Manage Conversations
          </Heading>
          <Link to="/create">
            <Button variant="primary">Create New</Button>
          </Link>
        </Flex>
        <Box mt={5}>
          <Box sx={{ mb: [3] }}>{this.props.loading ? "Loading conversations..." : null}</Box>
          {err ? (
            <Text>{"Error loading conversations: " + err.status + " " + err.statusText}</Text>
          ) : null}
          {conversations &&
            conversations
              .filter((c) => !c.is_archived)
              .map(
                (c, i) =>
                  this.filterCheck(c) && (
                    <ConversationRow
                      key={c.conversation_id || i}
                      i={i}
                      c={c}
                      stats={conversation_stats[c.conversation_id]}
                      dispatch={this.props.dispatch}
                    />
                  )
              )}
          <br />
          {this.state.showArchived &&
            conversations &&
            conversations
              .filter((c) => c.is_archived)
              .map(
                (c, i) =>
                  this.filterCheck(c) && (
                    <ConversationRow
                      key={c.conversation_id || i}
                      i={i}
                      c={c}
                      stats={conversation_stats[c.conversation_id]}
                      dispatch={this.props.dispatch}
                    />
                  )
              )}
          {!!conversations?.find((c) => c.is_archived) && (
            <Button
              variant="outlineGray"
              sx={{ mt: [3] }}
              onClick={() =>
                this.setState({ ...this.state, showArchived: !this.state.showArchived })
              }
            >
              {this.state.showArchived
                ? "Hide archived conversations"
                : "Show archived conversations"}
            </Button>
          )}
        </Box>
      </Box>
    )
  }
}

ManageConversations.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      status: PropTypes.number,
      statusText: PropTypes.string,
    }),
  ]),
  loading: PropTypes.bool,
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      conversation_id: PropTypes.string,
    })
  ),
  history: PropTypes.shape({
    pathname: PropTypes.string,
    push: PropTypes.func,
  }),
}

export default connect((state: RootState) => state.stats)(
  connect((state: RootState) => state.conversations)(ManageConversations)
)