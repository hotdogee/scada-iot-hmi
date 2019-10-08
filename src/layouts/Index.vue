<template>
  <q-layout view="hhh lpr fff">
    <q-header class="bg-white text-grey-9">
      <q-toolbar elevated>
        <img src="/statics/icons/favicon-32x32.png" />
        <q-toolbar-title class="title">
          <!-- <div class="text-subtitle1">蘭陽地熱 SCADA/IoT</div>
          <div class="text-subtitle2">{{ version.ui }}</div> -->
          <q-item-label>蘭陽地熱 SCADA/IoT</q-item-label>
          <q-item-label caption>
            {{ version.ui }}
          </q-item-label>
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="q-mr-xs"
        >
          <q-menu max-height="130px">
            <q-list style="min-width: 100px">
              <q-item>
                <q-item-section>無推播通知</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="person"
        >
          <q-menu fit>
            <q-card class="user-form">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="~assets/avatar-640.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>訪客權限</q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
            <!-- <sign-out
              v-if="isSignedIn"
              v-bind="displayInfo"
              @sign-out="signOut()"
              :errors="errors"
              :pending="pending"
            />
            <transition
              v-if="!isSignedIn"
              :name="
                showUserForm === 'sign-in'
                  ? 'fade-slide-left'
                  : 'fade-slide-right'
              "
            >
              <sign-in
                v-if="showUserForm === 'sign-in'"
                @show-sign-up="showUserForm = 'sign-up'"
                @show-reset-password="showUserForm = 'reset-password'"
                @sign-in="signIn(credentials)"
                @google="google()"
                @facebook="facebook()"
                @twitter="twitter()"
                @line="line()"
                v-bind.sync="credentials"
                :errors="errors"
                :pending="pending"
              />
              <sign-up
                v-if="showUserForm === 'sign-up'"
                @show-sign-in="showUserForm = 'sign-in'"
                @sign-up="signUp(credentials)"
                v-bind.sync="credentials"
                :errors="errors"
                :pending="pending"
              />
              <reset-password
                v-if="showUserForm === 'reset-password'"
                @show-sign-in="showUserForm = 'sign-in'"
                @reset-password="requestPasswordReset(credentials)"
                v-bind.sync="credentials"
                :errors="errors"
                :pending="pending"
              />
            </transition> -->
          </q-menu>
        </q-btn>
      </q-toolbar>
      <!-- Navigation -->
      <q-tabs class="bg-grey-9 text-white">
        <!-- <q-route-tab icon="subject" to="/text" label="文字" /> -->
        <q-route-tab
          icon="dashboard"
          to="/card"
          label="即時數據"
        />
        <q-route-tab
          icon="timeline"
          to="/chart"
          label="歷史統計"
        />
        <q-route-tab
          icon="videocam"
          to="/cam"
          label="現場直播"
        />
        <q-route-tab
          disable
          icon="videogame_asset"
          to="/dcs"
          label="電廠控制"
        >
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 5]"
          >
            無權限
          </q-tooltip>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <q-footer
      elevated
      class="bg-white text-grey-9 text-overline"
    >
      <q-toolbar>
        <div class="ellipsis">
          Made with
          <span class="text-red-14">❤</span> by Han Lin (hotdogee)
        </div>
        <q-space></q-space>
        <div class="copyright">
          © {{ new Date().getFullYear() }} 蘭陽地熱
        </div>
      </q-toolbar>
    </q-footer>

    <q-page-container class="bg-grey-9">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import SignIn from 'components/user/SignIn.vue'
// import SignUp from 'components/user/SignUp.vue'
// import SignOut from 'components/user/SignOut.vue'
// import ResetPassword from 'components/user/ResetPassword.vue'
import { openURL } from 'quasar'
// import { mapState, mapActions, mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {
  name: 'layouts.Index',
  // components: {
  //   SignIn,
  //   SignUp,
  //   SignOut,
  //   ResetPassword
  // },
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        recaptchaToken: '',
        disableGoogle: false,
        disableFacebook: false,
        disableTwitter: false
      }
    }
  },
  computed: {
    ...mapState('system', ['version', 'status'])
  },
  created () {
    this.$info('created') //  ${__filename}
  },
  methods: {
    openURL
  }
}
</script>

<style>
.copyright {
  min-width: 7.041rem;
  white-space: nowrap;
  overflow: hidden;
}
.title {
  line-height: 2rem;
  font-size: 1.125rem;
}
.q-tab__label {
  font-size: 1rem;
}
@media (min-width: 992px) {
  .q-tab,
  .q-tab.icon-and-label {
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
