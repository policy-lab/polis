/** @jsx jsx */

import React, { useState, useRef, useLayoutEffect } from "react"
import { Box, Heading, Button, Text, Textarea, Flex, jsx } from "theme-ui"
import { TbExternalLink } from "react-icons/tb"

import { surveyBox, surveyHeadingMini } from "./index"
import SurveyCard from "./survey_card"

const SurveyCards = ({
  user,
  conversation_id,
  votedComments,
  unvotedComments,
  setVotedComments,
  submittedComments,
  setSubmittedComments,
  onVoted,
  goTo,
  zid_metadata,
}) => {
  const cardsBoxRef = useRef<HTMLElement>()
  const [maxHeight, setMaxHeight] = useState<number>()

  useLayoutEffect(() => {
    if (!cardsBoxRef.current) return
    const maxh =
      Math.max(
        cardsBoxRef.current.children[0].scrollHeight,
        cardsBoxRef.current.children[0].clientHeight
      ) + 4
    setMaxHeight(maxh)
  }, [votedComments.length])

  return (
    <Box>
      {unvotedComments.length > 0 && (
        <Box sx={{ position: "relative" }} ref={cardsBoxRef}>
          {unvotedComments[0] && (
            <SurveyCard
              key={unvotedComments[0].tid}
              comment={unvotedComments[0]}
              conversationId={conversation_id}
              onVoted={onVoted}
              hasVoted={false}
              maxHeight={maxHeight}
            />
          )}
          {unvotedComments.length > 1 &&
            unvotedComments.slice(0, 5).map((comment, index) => {
              return (
                <Box
                  key={comment.txt}
                  sx={{
                    zIndex: -1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform:
                      index === 0
                        ? "rotate(-0.25deg)"
                        : index === 1
                        ? "rotate(0.25deg)"
                        : index === 2
                        ? "rotate(-0.65deg)"
                        : index === 3
                        ? "rotate(0.65deg)"
                        : index === 4
                        ? "rotate(-1deg)"
                        : "rotate(1deg)",
                  }}
                >
                  <SurveyCard
                    comment={unvotedComments[index]}
                    conversationId={conversation_id}
                    onVoted={onVoted}
                    hasVoted={false}
                    maxHeight={maxHeight}
                  />
                </Box>
              )
            })}
        </Box>
      )}
      {unvotedComments.length === 0 && votedComments.length === 0 && (
        <Box sx={{ ...surveyBox, pt: [5] }}>
          <Heading as="h3" sx={{ ...surveyHeadingMini, fontSize: "22px" }}>
            No statements
          </Heading>
          <Text sx={{ mb: [3] }}>Nobody has added any responses to this survey yet.</Text>
        </Box>
      )}

      {unvotedComments.length === 0 && (
        <React.Fragment>
          <Box sx={{ ...surveyBox, pt: [5] }}>
            <Heading as="h3" sx={{ ...surveyHeadingMini, fontSize: "22px" }}>
              You’re done for now!
            </Heading>
            <Text sx={{ mb: [2] }}>
              You’ve voted on all {votedComments.length} statements submitted so far.
            </Text>
            <Text sx={{ mb: [2] }}>
              Come back to this page to see new statements as they’re written by others.
            </Text>
          </Box>
          {(zid_metadata.postsurvey || zid_metadata.postsurvey_redirect) && (
            <Button
              variant="primary"
              onClick={() =>
                zid_metadata.postsurvey
                  ? goTo("postsurvey")
                  : window.open(zid_metadata.postsurvey_redirect)
              }
              sx={{ width: "100%", mb: [3] }}
            >
              Go to next steps
              {!zid_metadata.postsurvey && (
                <TbExternalLink style={{ marginLeft: "5px", position: "relative", top: "2px" }} />
              )}
            </Button>
          )}
        </React.Fragment>
      )}
    </Box>
  )
}

export default SurveyCards
