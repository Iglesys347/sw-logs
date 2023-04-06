<template>
    <v-snackbar v-model="snackbar" :timeout="timeout" transition="fade-transition" :color="color" location="top right">
        <v-icon>{{ icon }}</v-icon>
        {{ msg }}

        <template v-slot:actions>
            <v-btn icon="mdi-close" size="small" @click="snackbar = false"></v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    data: () => ({
        snackbar: false,
        timeout: 5000
    }),
    props: {
        msg: String,
        type: String
    },
    computed: {
        color() {
            if (this.type == "error") {
                return "red"
            }
            if (this.type == "success") {
                return "green"
            }
            if (this.type == "warning") {
                return "orange"
            }
            return "blue"
        },
        icon() {
            if (this.type == "error" || this.type == "warning") {
                return "mdi-alert-circle-outline"
            }
            if (this.type == "success") {
                return "mdi-check-circle-outline"
            }
            return "mdi-information-outline"
        }
    },

    watch: {
        msg(newValue) {
            if (newValue == "") {
                this.snackbar = false
            } else {
                this.snackbar = true
            }
        },
        snackbar(newValue) {
            if (!newValue) {
                this.$emit("message-cleared")
            }
        }
    }
}
</script>