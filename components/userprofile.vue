<template>
    <div class="m-2">
        <div class="border-bottom px-2">
            <h2 class="mb-0">{{ presentedUser.name }}</h2>
        </div>

        <div class="p-2 d-flex">
            <div class="border-right pr-2 mr-2">
                <div>
                    <label
                        title="Presentation devices will not be able to change game data and are used by the DM to present various info to players">
                        <input type="checkbox" v-model="presentedUser.settings.demonstarationDevice" />
                        Presentation device
                    </label>
                </div>
                <div>
                    <label
                        title="With Afloat game windows will not be stacked in the center of the screen, enabling user to freely move them across the screen">
                        <input type="checkbox" v-model="presentedUser.settings.useAfloat" />
                        Use Afloat
                    </label>
                </div>
            </div>

            <div class="d-flex " style="gap:0.5rem">
                <div>
                    Prefered theme: {{ presentedUser.settings.preferedTheme }}
                    <div class="d-flex" style="gap:0.5rem">
                        <div v-for="theme in avaliableThemes" :title="theme.name">
                            <label>
                                <input type="radio" :value="theme.name" v-model="presentedUser.settings.preferedTheme"
                                    class="d-none" />
                                <div class="theme-semicicle-box position-relative"
                                    v-bind:class="{ 'selected-halo': (presentedUser.settings.preferedTheme === theme.name) }"
                                    :style="{ background: theme.background }">
                                    <div class="theme-semicicle theme-semicicle-first position-absolute"
                                        :style="{ background: theme.primary }"></div>
                                    <div div class="theme-semicicle theme-semicicle-second position-absolute"
                                        :style="{ background: theme.secondary }"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

            </div>



        </div>

        <div>
            <button class="btn btn-primary" @click="$modal.show('changePassword')">change password</button>
        </div>

        <modal name="changePassword" :adaptive="true">
            <assistModalLook :caption="'Password change'" @ok="changePassword">
                <div>
                    <div class="text-center">Enter new password</div>
                    <input type="password" v-model="newPassword"/>
                </div>
            </assistModalLook>
        </modal>


    </div>
</template>
<script>
export default {
    name: 'userprofile',

    model: {
        prop: 'user',
        event: 'input'
    },

    props: {
        user: {
            type: Object,
            default() {
                return {
                    name: 'Unnamed',
                    settings: {
                        demonstarationDevice: false,
                        useAfloat: false,
                        preferedTheme: null,
                    }
                }
            }
        },
    },

    data() {
        return {
            temporaryIgnoreForeignChange: false,//If user is change to comply with UserChanged event, there is no use sending update to the server.
            editable: true,
            presentedUser: this.user.settings == null ? Object.assign({}, this.user, { settings: {} }) : JSON.parse(JSON.stringify(this.user)),
            newPassword: '',
            avaliableThemes: [
                { name: 'darktheme-pur', primary: '#694481', secondary: '#7b7083', background: '#020202' },
                { name: 'darktheme-gol', primary: '#888a20', secondary: '#8f8f80', background: '#020202' },
                { name: 'notheme', primary: '#007bff', secondary: '#6c757d', background: '#fff' },
            ]
        }
    },

    watch: {
        presentedUser: {
            async handler(value, more, q) {
                this.$emit('input', this.presentedUser);
                if (this.temporaryIgnoreForeignChange) {
                    this.temporaryIgnoreForeignChange = false;
                } else if(this.editable) {
                    const response = await this.$axios.$post('/api/changeUser', this.presentedUser);
                    this.$auth.setUser(response.user);
                    $nuxt.$emit('userChanged', { user: response.user, source: this._uid });
                }
            },
            deep: true
        }
    },


    methods: {
        async changePassword() {
            this.$modal.hide('changePassword');
            const response = await this.$axios.$post('/api/changeUserPassword', {userId: this.presentedUser.id, password:this.newPassword});
            this.newPassword = null;
        }
    },

    mounted() {
        this.$nuxt.$on('userChanged', ({ user, source }) => {
            const userStringified = JSON.stringify(user);
            if ((user.id === this.presentedUser.id) && (userStringified !== JSON.stringify(this.presentedUser)) && (source !== this._uid)) {
                this.temporaryIgnoreForeignChange = true;
                this.presentedUser = JSON.parse(userStringified);
            }
        });
    },

}
</script>