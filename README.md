# Spoticord Link

Spoticord Link is a Next.js application that enables users to connect their Spotify accounts to [Spoticord](https://github.com/SpoticordMusic/spoticord).

## Easy On Click Deploy using Vercel (Quick and Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSpoticordMusic%2Fspoticord-link&env=DISCORD_TOKEN,DATABASE_URL,SPOTIFY_CLIENT_ID,SPOTIFY_CLIENT_SECRET,SPOTIFY_REDIRECT_URI&envDescription=All%20the%20Enviromental%20Variables%20are%20required%20for%20this%20to%20run.%20You%20can%20read%20the%20README.md%20file%20for%20more%20info%20about%20&envLink=https%3A%2F%2Fgithub.com%2FSpoticordMusic%2Fspoticord-link&project-name=spoticord-frontend&repository-name=spoticord-frontend-vercel)

Click the above button to deploy your own Spoticord-Frontend

> Just make sure to use correct values of Enviromental Variables. Read below for more info.

## Environment

| Variable | Description |
| :---: | --- |
| DISCORD_TOKEN | Any Discord bot token (can be different from a Spoticord instance), for resolving user information |
| DATABASE_URL | A postgresql database URL, which must point to the same database as your Spoticord instance |
| SPOTIFY_CLIENT_ID | Your Spotify app Client ID |
| SPOTIFY_CLIENT_SECRET | Your spotify app Client Secret |
| SPOTIFY_REDIRECT_URI | The full URI to redirect to after (un)successful Spotify authentication (e.g. http://localhost:3000/authorize or https://&lt;yourvercel.app&gt;/authorize) |

### Values for Variables

- DISCORD_TOKEN : Make sure to use different bot application [Create New Application](https://discord.com/developers/applications/ "Discord Dev Portal")
    
- DATABASE_URL : Make sure you use the same Postgres DB that you used for your Spoticord instance
    
    > There are some free online DB providers that you can checkout ([neon.tech](https://neon.tech), [avien.io](https://aiven.io/), [crunchydata.com](https://www.crunchydata.com/))
    
- SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET & SPOTIFY_REDIRECT_URI : Are required and you can get them from [Create New Application](https://developer.spotify.com/dashboard)

  > If you are using Vercel for deploying the front-end then make sure to update the `Redirect URIs` in Spotify Dev Dashboard & the Enviromental Variable value of `SPOTIFY_REDIRECT_URI` with the vercel-app url (e.g. https://<xyz>.vercel.app/authorize)
  > - Re-Deploy the project again with the updated URI value.


