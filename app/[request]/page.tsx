import BlurFade from "@/components/magicui/blur-fade";
import Particles from "@/components/magicui/particles";
import ShineBorder from "@/components/magicui/shine-border";
import { db } from "@/db";
import { linkRequests } from "@/db/schema";
import { getUserInfo } from "@/lib/discord";
import { CDN } from "@discordjs/rest";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AnimatedUserIcon } from "./components";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buildAuthorizeUrl } from "@/lib/spotify";

type Params = Promise<{ request: string }>;

export default async function LinkAccountPage({ params }: { params: Params }) {
  const { request } = await params;

  const entry = await db.query.linkRequests.findFirst({
    where: eq(linkRequests.token, request),
  });

  if (!entry || entry.expires < new Date()) {
    notFound();
  }

  const cdn = new CDN();
  const user = await getUserInfo(entry.user_id);
  const avatar = user.avatar
    ? cdn.avatar(user.id, user.avatar)
    : cdn.defaultAvatar(
        user.discriminator === "0000"
          ? Number((BigInt(user.id) >> 22n) % 6n)
          : Number(user.discriminator) % 5,
      );

  const authorizeUrl = buildAuthorizeUrl(request);

  return (
    <div className="relative flex h-full items-center justify-center">
      <BlurFade inView yOffset={12}>
        <ShineBorder
          className="contents p-0 md:grid [&>div:first-child]:hidden md:[&>div:first-child]:block"
          color={["#444444", "#444444"]}
        >
          <Card className="flex min-h-full w-full flex-col rounded-none md:min-h-auto md:max-w-md md:rounded-md">
            <CardHeader className="bg-muted flex items-center gap-4 p-6">
              {/* Images */}
              <AnimatedUserIcon image={avatar} />

              <div className="w-full">
                <div className="text-base font-medium md:text-lg">
                  Link your Spotify account
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Connect your Spotify account to Spoticord, and listen to the
                  music you enjoy.
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between space-y-4 p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium md:text-base">
                    We need some permissions first
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base">
                    Spoticord needs a few permissions from your Spotify account
                    to work its magic!
                  </p>
                </div>

                {/* Permissions */}

                <Alert className="">
                  <AlertTriangle className="size-[1em] translate-y-0.5 text-yellow-300!" />
                  <AlertTitle className="text-sm">Heads up!</AlertTitle>
                  <AlertDescription className="text-xs">
                    Using Spoticord may cause Spotify to reset your password.
                    <br />
                    Do <span className="underline">not</span> use the bot if you
                    do not have access to the email address associated with your
                    Spotify account.
                    <br />
                    <br />
                    <a
                      className="text-blue-400 underline"
                      href="https://github.com/SpoticordMusic/spoticord/discussions/53"
                      target="_blank"
                      rel="noreferer noopener"
                    >
                      Learn more.
                    </a>
                  </AlertDescription>
                </Alert>
                {/* <div className="space-y-4">
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs font-medium md:text-sm">
                      Read subscription details
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Spoticord needs to be able to determine whether your
                      account has Spotify Premium, which is{" "}
                      <strong>required</strong> for Spoticord to function.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs font-medium md:text-sm">
                      Control device playback
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Spoticord needs to be able to create devices and control
                      their playback within your Spotify account to function.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs font-medium md:text-sm">
                      Basic profile information
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Spoticord needs to know your username to be able to
                      authenticate with Spotify servers.
                    </p>
                  </div>
                  <Separator />
                </div> */}
              </div>
            </CardContent>

            <CardFooter className="relative flex-1 flex-col items-stretch gap-4 overflow-hidden">
              <div className="flex w-full items-end">
                <Button variant="outline" className="mr-0 ml-auto" asChild>
                  <a href={authorizeUrl} target="_blank" rel="noreferrer noopener">
                    <ExternalLinkIcon className="mr-2 size-4" />
                    Step 1: Authenticate with Spotify
                  </a>
                </Button>
              </div>

              <Separator />

              <form method="get" action="/authorize" className="space-y-2">
                <div className="text-sm font-medium md:text-base">
                  Step 2: paste the page Spotify sent you to
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">
                  After you click Agree, Spotify will send you to a page starting
                  with <code>http://127.0.0.1:8898/login</code> that won&apos;t load
                  &mdash; that&apos;s expected. Copy that page&apos;s full address
                  from your browser&apos;s address bar and paste it here.
                </p>
                <input type="hidden" name="state" value={request} />
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="http://127.0.0.1:8898/login?code=...&state=..."
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                />
                <div className="flex w-full items-end">
                  <Button type="submit" className="mr-0 ml-auto">
                    Finish linking
                  </Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </ShineBorder>
      </BlurFade>

      <Particles
        className="absolute inset-0 -z-10 hidden md:block"
        quantity={200}
        ease={80}
        color="#ffffff"
        refresh
      />
    </div>
  );
}
