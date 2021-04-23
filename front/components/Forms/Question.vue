<template>
    <section class="question" :style="style">
        <form ref="form" @submit.prevent >
            <label ref="label" class="">{{ label }}</label>
            <input
                v-if="step != 1"
                ref="input"
                :placeholder="placeholder"
                name="input"
                type="string"
                required
            >
            <div v-else ref="input" class="colors">
                <input type="radio" id="red" name="color" value="red">
                <label for="red">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="orange" name="color" value="orange">
                <label for="orange">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="yellow" name="color" value="yellow">
                <label for="yellow">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="green" name="color" value="green">
                <label for="green">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="darkgreen" name="color" value="darkgreen">
                <label for="darkgreen">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="blue" name="color" value="blue">
                <label for="blue">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="darkblue" name="color" value="darkblue">
                <label for="darkblue">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
                <input type="radio" id="purple" name="color" value="purple">
                <label for="purple">
                    <span class="color"></span>
                    <span class="selected"></span>
                </label>
            </div>
        </form>
        <button
            ref="button"
            class="button"
            @click="storeInfo"
        >
            {{ confirmation }}
        </button>
    </section>
</template>

<script>
    import gsap from 'gsap'

    export default {
        name: 'question',
        props: {
            label: {
                type: String,
                default: '',
                required: true
            },
            placeholder: {
                type: String,
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
            return {
                question: '',
                input: '',
                button: ''
            }
        },
        computed: {
            style () {
                return {
                    color: this.color
                }
            },
        },
        mounted() {
            this.input = this.$refs.input
            this.question = this.$refs.label
            this.button = this.$refs.button

            gsap.to(this.question, {
                y: -60,
                scale: 0.7,
                duration: 1,
                delay: 2,
                ease: "power3.out",
                onComplete: this.showInput
            })
        },
        methods: {
            showInput() {
                if (this.step === 1) {
                    const inputs = this.input.querySelectorAll('.color')
                    gsap.from(inputs, {y: +30, duration: 1, ease: "power3.out", stagger: 0.1})
                    gsap.to(inputs, {opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1})
                    gsap.to(this.button, {opacity: 1, duration: 1, ease: "power3.out"})
                } else {
                    gsap.from(this.input, {y: +30, duration: 1, ease: "power3.out"})
                    gsap.to([this.input, this.button], {opacity: 1, duration: 1, ease: "power3.out"})
                }
            },
            storeInfo(e) {
                e.preventDefault()
                let data = this.$refs.input.value

                if (this.step === 1) {
                    const colors = document.getElementsByName('color');
                    for(let i = 0; i < colors.length; i++) {
                        if(colors[i].checked)
                            data = colors[i].id
                    }
                }
                switch (this.step) {
                   case 0:
                       this.$store.commit('setUserName', data)
                       this.$emit('done')
                       break;
                    case 1:
                       this.$store.commit('setUserColor', data)
                       this.$emit('done')
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
                if (this.step > 1) {
                    this.$nuxt.$emit('endSceneTransition')
                    this.$nuxt.$emit('questionHidden')
                }
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
    height: 100vh;
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
    align-items: center;
}

label {
    font-size: 40px;
}

input {
    max-width: 250px;
    opacity: 0;
    text-align: center;
    font-size: 24px;
    color: white;
    padding-bottom: 10px;
    border-bottom: 1px #888888 solid;
}

.colors {
    width: 70%;
    display: flex;
    justify-content: space-between;
}

input[type="radio"] {
    display: none;
}

.color {
    opacity: 0;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
}

.selected {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transition: all ease-out 0.2s;
}

input[type="radio"] + label {
    position: relative;
    padding: 0 20px;
    transition: all ease-out 0.3s;
}

input[type="radio"]#red + label .color {
    background-color: #DC0C47;
}

input[type="radio"]#red + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#orange + label .color {
    background-color: #E8721F;
}

input[type="radio"]#orange + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#yellow + label .color {
    background-color: #EDC52C;
}

input[type="radio"]#yellow + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#green + label .color {
    background-color: #7BBD22;
}

input[type="radio"]#green + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#darkgreen + label .color {
    background-color: #0E7B33;
}

input[type="radio"]#darkgreen + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#blue + label .color {
    background-color: #1281AB;
}

input[type="radio"]#blue + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#darkblue + label .color {
    background-color: #1F6CAD;
}

input[type="radio"]#darkblue + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"]#purple + label .color {
    background-color: #7B4EA3;
}

input[type="radio"]#purple + label .selected {
    background-color: white;
    opacity: 0;
}

input[type="radio"] + label:hover {
    transform: translateY(-10px);
}

input[type="radio"]:checked + label .selected  {
    opacity: 0.2 !important;
}

.button {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    transition: opacity 0.3s ease;
    color: white !important;
}

.button:hover {
    opacity: 0.5 !important;
}

.button {
    opacity: 0;
    font-size: 12px;
}
</style>

