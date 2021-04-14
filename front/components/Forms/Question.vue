<template>
    <section>
        <p style="color: white" @click="setUserId('Julie')">Ajouter un utilisateur</p>
    </section>
</template>

<script>
    export default {
        name: 'question',
        async asyncData ({ app }) {
            // const ref = app.$fire.database.ref('users/julie/name')
            // ref.on('value', (snapshot) => {
            //   const data = snapshot.val();
            // })
        },
        data() {
            return {}
        },
        mounted() {
        },
        methods: {
            setUserId(name) {
            const newUser = this.$fire.database.ref('users/').push({
                name: name,
                color: ''
            })
            const userId = newUser.key
            this.$store.commit('setUserId', userId)
            this.$store.commit('setUserName', name)
            },
            setUserColor(color) {
            this.$fire.database.ref('users/' + this.$store.state.user.id).update({
                color: color
            })
            this.$store.commit('setUserColor', color)
            }
        },
        computed: {
            Style () {
            return {
                'background-color': this.$store.state.userColor
            }
            },
            myId () {
            return this.$store.state.user.id
            },
            myName () {
            return this.$store.state.user.name
            },
            nameSetted () {
            return this.$store.state.user.name != ''? true : false
            }
        }
    }
</script>
<style>

</style>

