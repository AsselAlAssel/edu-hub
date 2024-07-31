import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { StyledStack, StyledSubTitle, StyledTitle } from './Styled'
import LandingImageHeader from '@/public/images/landing/landing-header.jpg'
import Image from 'next/image'

export default function Header() {
    return (
        <StyledStack
            justifyContent={"center"}
            alignItems={"center"}
            id="home"
        >
            {/* <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: isMobile ? "fill" : "cover",
            zIndex: -2,
          }}
        >
          <source src={"/videos/landing-video.mp4"} type="video/mp4" />
        </video> */}
            {/* <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: 0.5,
                    zIndex: -1,
                }}
            /> */}
            <Stack direction={"row"} spacing={1.5} mt={6} mb={4.5}>
                <Stack direction={"column"} spacing={3} alignItems={"flex-start"}>
                    <Box >
                        <StyledTitle>مرحبًا بكم في موقع الفيزياء
                        </StyledTitle>
                    </Box>
                    <Box>

                        <StyledSubTitle>
                            اكتشف عالم الفيزياء من خلال دروس ومقاطع فيديو شاملة ومفيدة

                        </StyledSubTitle>
                    </Box>
                    <Button>
                        شاهد الفيديو التعريفي
                    </Button>
                </Stack>
                <Image src={LandingImageHeader} alt="landing-header"
                    style={{
                        maxWidth: "500px",
                    }}
                />

            </Stack>

            {/* <LandingVideoDialog
                open={openVideo}
                handleClose={() => setOpenVideo(false)}
            /> */}
        </StyledStack>
    )
}
