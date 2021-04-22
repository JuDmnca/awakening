<template>
    <section class="question" :style="style">
        <form action="">
            <label class="">{{ label }}</label>
            <input
                ref="input"
                :placeholder="placeholder"
                name="input"
                type="string"
                required
            >
        </form>
        <button v-if="step === 0" class="button" type="submit" @click="storeInfo">
            {{ confirmation }}
        </button>
        <div v-else class="buttons">
            <button type="submit" @click="acceptMic">
                J'accepte
            </button>
            <button type="submit" @click="refuseMic">
                Non merci
            </button>
        </div>
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
            placeholder: {
                type: Number,
                default: 'Pierre',
                required: false
            },
            step: {
                type: Number,
                default: 0,
                required: false
            },
            color: {
                type: String,
                default: 'white',
                required: false
            },
            confirmation: {
                type: String,
                default: '',
                required: false
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
        computed: {
            style () {
                return {
                    color: this.color
                }
            },
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
    width: 1000px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 40px;
}

.button {
    text-transform: uppercase;
}

.buttons {
    display: flex;
}
</style>

