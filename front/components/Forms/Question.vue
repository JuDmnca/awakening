<template>
    <section class="question">
        <form action="">
            <label class="">{{ label }}</label>
            <input
                ref="input"
                name="input"
                type="string"
                required
            >
        </form>
        <button class="" type="submit" @click="storeInfo">
            Envoyer
        </button>
    </section>
</template>

<script>
    export default {
        name: 'question',
        props: {
            label: {
                type: String,
                default: '',
                required: true
            },
            step: {
                type: Number,
                default: 0,
                required: true
            },
        },
        async asyncData ({ app }) {
            // const ref = app.$fire.database.ref('users/julie/name')
            // ref.on('value', (snapshot) => {
            //   const data = snapshot.val();
            // })
        },
        data() {
            return {}
        },
        methods: {
            storeInfo() {
                const data = this.$refs.input.value
                switch (this.step) {
                   case 0:
                       this.$store.commit('setUserName', data)
                       break;
                    case 1:
                       this.$store.commit('setUserColor', data)
                       break;
                    case 2:
                       this.$store.commit('setUserSmell', data)
                       break;
                    case 3:
                       this.$store.commit('setUserTaste', data)
                       break;
                    case 4:
                       this.$store.commit('setUserSound', data)
                       break;
                }
                this.$nuxt.$emit('endSceneTransition')
                this.$nuxt.$emit('questionHidden')
            },
            other() {
                // PUSH INFO TO FIREBASE : TO DO LATER AT THE END
                // const newUser = this.$fire.database.ref('users/').push({
                //     name: name,
                //     color: ''
                // })
                // const userId = newUser.key
                // this.$fire.database.ref('users/' + this.$store.state.user.id).update({
                //     color: color
                // })
            }
        }
    }
</script>

<style>
.question {
    position: absolute;
    width: 300px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: magenta;
}
</style>

