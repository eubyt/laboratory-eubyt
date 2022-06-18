import Dotenv from "dotenv";
import Twit from "twit";
import Axios from "axios";

Dotenv.config();

let Log = {
    id_stream: "",
    last_stream: "",
    last_game_name: "",
};

class Twitch {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async twitchCreateTokenAccess() {
        const response = await Axios.post("https://id.twitch.tv/oauth2/token", {
            client_id: process.env.TTV_CLIENT_ID,
            client_secret: process.env.TTV_CLIENT_SECRET,
            grant_type: "client_credentials",
        });
        return response.data.access_token;
    }

    async CheckStreamerOnline() {
        const response = await Axios.get(
            `https://api.twitch.tv/helix/streams?user_id=${this.user_id}`,
            {
                headers: {
                    "Client-ID": process.env.TTV_CLIENT_ID,
                    Authorization: `Bearer ${await this.twitchCreateTokenAccess()}`,
                },
            }
        );
        if (response.data.data.length > 0) {
            const { id, user_name, game_name, started_at, title } =
                response.data.data[0];
            return {
                streamer_online: true,
                user_name,
                game_name,
                started_at,
                title,
                id,
            };
        }
        return {
            streamer_online: false,
        };
    }
}

class Twitter {
    constructor() {
        this.T = new Twit({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        });

        this.T.get("account/verify_credentials", {
            include_entities: false,
            skip_status: true,
            include_email: false,
        })
            .then(() => {
                console.log("Autenticado com sucesso");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    PublicTweet(tweet) {
        this.T.post("statuses/update", { status: tweet }, (err, res) => {
            if (err) {
                throw err;
            }
            console.log("Tweet publicado com sucesso");
        })
            .then(function () {
                console.log("Publicado um tweet.");
            })
            .catch(function (err) {
                console.log(err);
            })
            .done();
    }

    UpdateBio(bio) {
        this.T.post("account/update_profile", {
            description: bio,
        })
            .then(function () {
                console.log("Bio atualizada.");
            })
            .catch(function (err) {
                console.log(err);
            })
            .done();
    }
}

const twitter = new Twitter();

function addZero(num) {
    return num < 10 ? "0" + num : num;
}

function formatDate(date) {
    const dateNow = new Date();
    const dateStream = new Date(date);
    const diff = dateNow.getTime() - dateStream.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    return `${days > 0 ? addZero(days) + "d " : ""}${addZero(hours) || "00"}h ${
        addZero(minutes) || "00"
    }m ${addZero(seconds) || "00"}s`;
}

function checkL4k3() {
    const twitch = new Twitch(118005288);
    twitch
        .CheckStreamerOnline()
        .then((response) => {
            if (response.streamer_online) {
                const { game_name, started_at, title, id } = response;
                // Verificar se são lives diferentes
                if (Log.id_stream === response.id) {
                    const newBio = `O streamer @l4k3live está online 🔴!\nCategoria: ${game_name}.\nTempo de streaming: ${formatDate(
                        started_at
                    )}.\nAssistir 🎥 https://www.twitch.tv/l4k3`;
                    twitter.UpdateBio(newBio);
                    if (Log.last_game_name !== game_name) {
                        twitter.PublicTweet(
                            `O streamer @l4k3live está online 🔴!\n\nNova Categoria: ${game_name}.\nAntiga Categoria: ${
                                Log.last_game_name
                            }\n\nTempo de streaming: ${formatDate(
                                started_at
                            )}.\nAssistir agora 🎥: https://www.twitch.tv/l4k3`
                        );
                        Log.last_game_name = game_name;
                    }
                } else {
                    Log.id_stream = id;
                    const newBio = `O streamer @l4k3live está online agora! 🎉\n\n~~ INFOS ~~\n"${title}"\n\nCategoria: ${game_name}.\n\nAssistir agora 🎥 https://www.twitch.tv/l4k3`;
                    Log.last_game_name = game_name;

                    twitter.PublicTweet(newBio);
                }
            } else {
                const newBio = `O streamer @l4k3live está offline! 😡\nEspere em 🎥 https://www.twitch.tv/l4k3`;
                twitter.UpdateBio(newBio);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function warnL4k3Offline() {
    const twitch = new Twitch(118005288);
    twitch
        .CheckStreamerOnline()
        .then((response) => {
            if (!response.streamer_online) {
                const newTweet = `O streamer @l4k3live ainda está offline! 😡\n\nEspere em 🎥 https://www.twitch.tv/l4k3`;
                twitter.PublicTweet(newTweet);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

setInterval(checkL4k3, 1000 * 30);
setInterval(warnL4k3Offline, 1000 * 60 * 60 * 6);
