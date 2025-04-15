# Spoticord Link

Spoticord Link is a Next.js application that enables users to connect their Spotify accounts to [Spoticord](https://github.com/SpoticordMusic/spoticord).

## One-click deploy on Vercel (Quick and Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSpoticordMusic%2Fspoticord-link&env=DISCORD_TOKEN,DATABASE_URL,SPOTIFY_CLIENT_ID,SPOTIFY_CLIENT_SECRET,SPOTIFY_REDIRECT_URI&envDescription=All%20the%20enviroment%20variables%20are%20required%20for%20this%20app%20to%20run.%20You%20can%20read%20the%20README.md%20file%20for%20more%20info.&envLink=https%3A%2F%2Fgithub.com%2FSpoticordMusic%2Fspoticord-link&project-name=spoticord-link&repository-name=spoticord-link-vercel)

Click the above button to quickly deploy the application on Vercel.

> Make sure to supply the correct environment variables, otherwise the link app will not work properly. Read more about the variables below.

## Environment

|             Variable             | Description                                                                                                                                                           |
| :------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    DISCORD_TOKEN<sup>1</sup>     | Any Discord bot token (can be different from a Spoticord instance), for resolving user information                                                                    |
|     DATABASE_URL<sup>2</sup>     | A postgresql database URL, which must point to the same database as your Spoticord instance                                                                           |
|        SPOTIFY_CLIENT_ID         | Your Spotify app Client ID                                                                                                                                            |
|      SPOTIFY_CLIENT_SECRET       | Your spotify app Client Secret                                                                                                                                        |
| SPOTIFY_REDIRECT_URI<sup>3</sup> | The full URI to redirect to after (un)successful Spotify authentication (e.g. http://localhost:3000/authorize or https://&lt;auto-generated&gt;.vercel.app/authorize) |

### Important notes

- <sup>1</sup>: While not required, you may use a different Discord application than the one used for hosting the bot
- <sup>2</sup>: Make sure you use the same PostrgesDB database that you use for your Spoticord instance
- <sup>3</sup>: If you are using "One click deploy on Vercel" to deploy this app, this URL is not yet known initially. You will have to manually edit the `SPOTIFY_REDIRECT_URI` with the generated URL (which should be something along the lines of `https://spoticord-link-vercel-<generated-metadata>.vercel.app/authorize`), and redeploy the app.
