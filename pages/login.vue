<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-1 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body px-5 text-center">

              <div class="mb-md-5 mt-md-4" v-if="showLoginScreen">
                <form @submit.prevent="attemptLogin">

                  <h2 class="fw-bold mb-2 text-uppercase">DNDHLP</h2>
                  <p class="text-white-50 mb-5">Please enter your login and password!</p>

                  <div v-if="!tokenMode">
                    <div class="form-outline form-white mb-4">
                      <input v-model="login.username" type="text" id="typeLoginlX"
                        class="form-control form-control-lg" />
                      <label class="form-label" for="typeLoginlX">Login</label>
                    </div>

                    <div class="form-outline form-white mb-4">
                      <input v-model="login.password" type="password" id="typePasswordX"
                        class="form-control form-control-lg" />
                      <label class="form-label" for="typePasswordX">Password</label>
                    </div>

                    <!--<p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>-->

                    <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                  </div>
                  
                  <div v-else>
                    <div class="form-outline form-white mb-4">
                      <input v-model="token" type="text" id="token" class="form-control form-control-lg" />
                      <label class="form-label" for="token">Token</label>
                    </div>
                    
                    <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                  </div>

                  <button class="btn btn-outline-light btn-lg px-5 mt-2" @click.prevent="flipTokenMode"><span
                      v-if="tokenMode">Use Login/Password</span><span v-else>Use token</span></button>

                      <button class="btn btn-outline-light btn-lg px-5 mt-2" @click.prevent="showStat">stat</button>

                </form>
              </div>
              <div class="d-flex justify-content-center" v-else>
                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <!--<div>
              <p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a>
              </p>
            </div>-->

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.gradient-custom {
  background: #6a11cb;
  background: -webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));
  background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
}
</style>

<script>
import Vue from 'vue'

export default Vue.extend({
  auth: 'guest',
  head() {
    return {
      htmlAttrs: {
        class: 'notheme'
      },
    }
  },
  name: "LoginPage",
  data() {
    return {
      showLoginScreen: true,
      token:"",
      counter: 0,
      tokenMode: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  mounted() {

    if(this.$route.query.logout) {
      let query = Object.assign({}, this.$route.query);
      delete query.logout;
      this.$router.replace({ query });
    }

  },
  methods: {
    async attemptLogin() {
      this.showLoginScreen = false;
      try {
        var data = {};

        if(this.tokenMode) {
          data.token = this.token;
        } else {
          data = this.login;
        }

        let response = await this.$auth.loginWith('local', { data: data });
        if(response.data.user) {
          this.$auth.setUser(response.data.user);
        }
      } catch (err) {
        console.log(err)
      }
      this.showLoginScreen = true;
      console.log(this.$auth);
    },
    showStat() {
      console.log(this.$auth);
    },
    flipTokenMode() {
      console.log(this.$route);
      this.tokenMode = !this.tokenMode;
    }
  }
})
</script>
