// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

/** @jsx jsx */

import React, { useRef, useCallback, useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Heading, Box, Text, jsx } from "theme-ui"
import toast from "react-hot-toast"

import { handleZidMetadataUpdate } from "../../actions"
import NoPermission from "./no-permission"
import { CheckboxField } from "./CheckboxField"
import SeedComment from "./seed-comment"

import Url from "../../util/url"
import ComponentHelpers from "../../util/component-helpers"
import { RootState } from "../../util/types"

const ConversationConfig: React.FC<{
  dispatch: Function
  zid_metadata: {
    conversation_id: string
    topic: string // actually: title
    description: string // actually: intro text
    survey_caption: string
    postsurvey: string
    postsurvey_limit: string
    postsurvey_submissions: string
    postsurvey_redirect: string
    is_owner: boolean
    is_mod: boolean
  }
  error: string
  loading: boolean
}> = ({ dispatch, zid_metadata, error, loading }) => {
  // {
  //    const reportsPromise = api.get("/api/v3/reports", {
  //      conversation_id: this.props.conversation_id,
  //    })
  //    reportsPromise.then((reports) => {
  //      this.setState({
  //        loading: false,
  //        reports: reports,
  //      })
  //    })

  //                document.location = `/r/${conversation_id}/${this.state.reports[0].report_id}`

  const topicRef = useRef<HTMLInputElement>()
  const descriptionRef = useRef<HTMLTextAreaElement>()
  const survey_captionRef = useRef<HTMLTextAreaElement>()
  const postsurveyRef = useRef<HTMLTextAreaElement>()
  const postsurveyLimitRef = useRef<HTMLInputElement>()
  const postsurveySubmissionsRef = useRef<HTMLInputElement>()
  const postsurveyRedirectRef = useRef<HTMLInputElement>()

  const [updatedZidMetadata, setUpdatedZidMetadata] = useState(zid_metadata)

  const handleStringValueChange = useCallback(
    (field: string, element) => {
      dispatch(handleZidMetadataUpdate(zid_metadata, field, element.value))
    },
    [dispatch, handleZidMetadataUpdate, zid_metadata]
  )

  const handleIntegerValueChange = useCallback(
    (field: string, element) => {
      if (element.value === "") {
        dispatch(handleZidMetadataUpdate(zid_metadata, field, 0))
      } else {
        const val = parseInt(element.value, 10)
        if (isNaN(element.value) || element.value.toString() !== element.value) {
          toast.error("Invalid value")
          return
        }
        dispatch(handleZidMetadataUpdate(zid_metadata, field, element.value))
      }
    },
    [dispatch, handleZidMetadataUpdate, zid_metadata]
  )

  if (zid_metadata && !zid_metadata.is_owner && !zid_metadata.is_mod) {
    return <NoPermission />
  }

  return (
    <Box>
      <Heading
        as="h3"
        sx={{
          fontSize: [3, null, 4],
          lineHeight: "body",
          mb: [3, null, 4],
        }}
      >
        Configure
      </Heading>
      <Box sx={{ mb: [4] }}>{error ? <Text>Error Saving</Text> : null}</Box>

      <CheckboxField field="is_active" label="Conversation is open">
        Uncheck to disable voting
      </CheckboxField>

      <Box sx={{ mt: [4], mb: [4] }}>
        <Link sx={{ variant: "styles.a" }} to={"/c/" + zid_metadata.conversation_id}>
          Go to survey
        </Link>
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>Title</Text>
        <input
          ref={topicRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            borderRadius: 2,
            padding: [2],
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          onBlur={(e) => handleStringValueChange("topic", topicRef.current)}
          defaultValue={zid_metadata.topic}
        />
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>Instructions</Text>
        <textarea
          ref={descriptionRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            height: "7em",
            resize: "none",
            padding: [2],
            borderRadius: 2,
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          data-test-id="description"
          onBlur={(e) => handleStringValueChange("description", descriptionRef.current)}
          defaultValue={zid_metadata.description}
        />
      </Box>

      <Heading as="h3" sx={{ mt: 5, mb: 4 }}>
        Post-Survey Redirect
      </Heading>

      <Box sx={{ mb: [4], fontStyle: "italic" }}>
        Once participants have submitted both the votes and statements expected, they will be guided
        to the post-survey page.
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>
          Votes Expected
          <Text sx={{ display: "inline", color: "lightGray", ml: [2] }}>Optional</Text>
        </Text>
        <input
          ref={postsurveyLimitRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            borderRadius: 2,
            padding: [2],
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          onBlur={(e) => handleIntegerValueChange("postsurvey_limit", postsurveyLimitRef.current)}
          defaultValue={zid_metadata.postsurvey_limit || ""}
        />
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>
          Statements Expected
          <Text sx={{ display: "inline", color: "lightGray", ml: [2] }}>Optional</Text>
        </Text>
        <input
          ref={postsurveySubmissionsRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            borderRadius: 2,
            padding: [2],
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          onBlur={(e) =>
            handleIntegerValueChange("postsurvey_submission", postsurveySubmissionsRef.current)
          }
          defaultValue={zid_metadata.postsurvey_submissions || ""}
        />
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>
          Post-Survey Text
          <Text sx={{ display: "inline", color: "lightGray", ml: [2] }}>Optional</Text>
        </Text>
        <textarea
          placeholder="You’re all done! Thanks for contributing your input. You can expect to hear back from us after..."
          ref={postsurveyRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            height: "7em",
            resize: "none",
            padding: [2],
            borderRadius: 2,
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          data-test-id="postsurvey"
          onBlur={(e) => handleStringValueChange("postsurvey", postsurveyRef.current)}
          defaultValue={zid_metadata.postsurvey}
        />
      </Box>

      <Box sx={{ mb: [3] }}>
        <Text sx={{ mb: [2] }}>
          Post-Survey Link
          <Text sx={{ display: "inline", color: "lightGray", ml: [2] }}>
            Optional. Shown as a button after the survey
          </Text>
        </Text>
        <input
          placeholder="https://"
          ref={postsurveyRedirectRef}
          sx={{
            fontFamily: "body",
            fontSize: [2],
            width: "100%",
            maxWidth: "35em",
            borderRadius: 2,
            padding: [2],
            border: "1px solid",
            borderColor: "mediumGray",
          }}
          onBlur={(e) =>
            handleStringValueChange("postsurveyRedirect", postsurveyRedirectRef.current)
          }
          defaultValue={zid_metadata.postsurvey_redirect || ""}
        />
      </Box>

      <Heading as="h3" sx={{ mt: [6], mb: 4 }}>
        Customize the user interface
      </Heading>

      <CheckboxField field="write_type" label="Enable comments" isIntegerBool>
        Participants can write their own cards (Recommended: ON)
      </CheckboxField>

      <CheckboxField field="auth_needed_to_write" label="Email required to comment">
        Email registration required to write cards (Recommended: OFF)
      </CheckboxField>

      <CheckboxField field="strict_moderation" label="Moderator approval for comments">
        Require moderators to approve submitted comments, before voters can see them
      </CheckboxField>

      <CheckboxField field="help_type" label="Show help text" isIntegerBool>
        Show verbose instructions when writing comments
      </CheckboxField>

      <CheckboxField field="importance_enabled" label="Importance Enabled">
        [Experimental] Show the "This comment is important" checkbox on the embed interface (only
        embeds!)
      </CheckboxField>

      {/*
        <CheckboxField
          field="subscribe_type"
          label="Prompt participants to subscribe to updates"
          isIntegerBool
        >
          Prompt participants after they have finished voting to provide their email address, to receive notifications when there are new comments to vote on.
        </CheckboxField>

        <CheckboxField field="auth_opt_fb" label="Facebook login prompt">
          Show Facebook login prompt
        </CheckboxField>

        <CheckboxField field="auth_opt_tw" label="Twitter login prompt">
          Show Twitter login prompt
        </CheckboxField>

        <CheckboxField field="auth_needed_to_vote" label="Require Auth to Vote">
          Participants cannot vote without first connecting either Facebook or Twitter
        </CheckboxField>
         */}

      <Heading as="h3" sx={{ mt: 5, mb: 4 }}>
        Embed
      </Heading>
      <Box>
        <Text>Copy this HTML into your page to embed this survey.</Text>
        <Box sx={{ my: [2], px: [3], py: [1], border: "1px solid lightGray", borderRadius: "6px" }}>
          <pre style={{ fontSize: "14px" }}>
            {"<div"}
            {" class='polis'"}
            {" data-conversation_id='" + zid_metadata.conversation_id + "'>"}
            {"</div>\n"}
            {"<script async src='" + Url.urlPrefix + "embed.js'></script>"}
          </pre>
        </Box>
      </Box>

      <Heading as="h3" sx={{ mt: 5, mb: 4 }}>
        Add seed comments
      </Heading>

      <SeedComment params={{ conversation_id: zid_metadata.conversation_id }} dispatch={dispatch} />

      <Box sx={{ mt: [4] }}>
        <Link sx={{ variant: "styles.a" }} to={"/c/" + zid_metadata.conversation_id}>
          Go to survey
        </Link>
      </Box>
    </Box>
  )
}

export default connect((state: RootState) => state.user)(
  connect((state: RootState) => state.zid_metadata)(ConversationConfig)
)
