<template>
    <Message :msg="message" :type="messType" @message-cleared="message = ''"></Message>

    <v-app :theme="theme">
        <v-app-bar app>
            <v-btn icon="mdi-menu" size="x-large" variant="plain" @click="toggleSidebar()"></v-btn>

            <v-spacer></v-spacer>

            <v-img src="banner.png" max-height="30"></v-img>

            <v-spacer></v-spacer>

            <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="onClick"></v-btn>

        </v-app-bar>
        <v-footer app class="text-center d-flex flex-column">
            <div class="d-flex align-center">
                This application shows how to centralize Python logs using Redis Streams and the log handler redis-logs
            </div>
            <div>
                <v-btn v-for="icon in icons" :key="icon" class="mx-4" :prepend-icon="icon.icon" :href="icon.href"
                    target="_blank" variant="plain">{{ icon.text }}</v-btn>
            </div>
        </v-footer>

        <v-navigation-drawer app v-model="showSidebar">
            <v-list v-for="(item, i) in items" :key="i">
                <router-link :to="item.router" style="text-decoration: none; color: inherit;">
                    <v-list-item active-color="primary" :active="currentComp == item.text" :value="item"
                        @click="setComp(item.text)">
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item>
                </router-link>
            </v-list>
        </v-navigation-drawer>


        <v-main>
            <v-container fluid>
                <router-view :key="$route.path" />
            </v-container>
        </v-main>

    </v-app>
</template>

<script>
import { ref } from 'vue'
import Message from './components/Message.vue';
import { useStore } from './stores/data'

const WS_HOST = import.meta.env.VITE_WS_HOST ? import.meta.env.VITE_WS_HOST : "localhost";
const WS_PORT = import.meta.env.VITE_WS_PORT ? import.meta.env.VITE_WS_PORT : 3000;

export default {
    setup() {
        // setup the user store
        const store = useStore();
        return {
            store,
        };
    },
    created() {
        this.data = [];
        const ws = new WebSocket(`ws://${WS_HOST}:${WS_PORT}`);
        ws.onmessage = ({ data }) => {
            let message = JSON.parse(data);
            for (let msg of message) {
                if (this.store.data.length >= this.store.maxDataSize) {
                    this.store.data.pop();
                }
                this.store.data.unshift(msg);
            }
        };
        ws.onerror = () => {
            this.message = "Unable to connect to WebSocket";
            this.messType = "error";
        };
    },
    data() {
        return {
            userName: "default",
            items: [
                { text: "All logs", icon: "mdi-application-cog-outline", tooltip: "All applications", router: "/apps" },
                { text: "Application 1", icon: "mdi-application-cog-outline", tooltip: "Application 1", router: "/app/1" },
                { text: "Application 2", icon: "mdi-application-cog-outline", tooltip: "Application 2", router: "/app/2" },
                { text: "Application 3", icon: "mdi-application-cog-outline", tooltip: "Application 3", router: "/app/3" },
            ],
            currentComp: "",
            theme: ref("dark"),
            showSidebar: true,
            icons: [
                {
                    icon: "mdi-github",
                    text: "SW logs",
                    href: ""
                },
                {
                    icon: "mdi-github",
                    text: "redis-logs",
                    href: "https://github.com/Iglesys347/redis-log-handler"
                },
                {
                    icon: "mdi-database",
                    text: "Redis",
                    href: "https://redis.io/"
                }
            ],

            message: "",
            messType: ""
        };
    },
    methods: {
        onClick() {
            this.theme = this.theme === "light" ? "dark" : "light";
        },
        setComp(comp) {
            this.currentComp = comp;
        },
        toggleSidebar() {
            this.showSidebar = this.showSidebar ? false : true;
        },
    },
    computed: {
        shortUserName() {
        }
    },
    components: { Message }
}
</script>
