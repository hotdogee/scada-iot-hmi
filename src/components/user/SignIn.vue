<template>
  <q-card
    flat
    class="user-form"
  >
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">
            {{ $t('Sign in') }}
          </div>
        </div>
        <div class="col-auto text-h5">
          <q-icon name="security" />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        type="email"
        :label="$t('Email')"
        :value="email"
        clearable
        :error="$v.email.$error"
        :error-message="errorMessages($v.email)"
        bottom-slots
        autocomplete="email"
        @blur="$v.email.$touch"
        @input="$emit('update:email', $event)"
        @keyup.enter="emitSignIn"
      >
        <template v-slot:prepend>
          <q-icon name="alternate_email" />
        </template>
        <!-- <template v-slot:append>
          <q-icon
            v-if="email !== ''"
            name="close"
            class="cursor-pointer"
            @click="email = ''"
          />
        </template>-->
      </q-input>
      <q-input
        type="password"
        :label="$t('Password')"
        :value="password"
        clearable
        :error="$v.password.$error"
        :error-message="errorMessages($v.password)"
        bottom-slots
        autocomplete="current-password"
        @blur="$v.password.$touch"
        @input="$emit('update:password', $event)"
        @keyup.enter="emitSignIn"
      >
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
        <!-- <template v-slot:append>
          <q-icon
            v-if="password !== ''"
            name="close"
            class="cursor-pointer"
            @click="password = ''"
          />
        </template>-->
        <template v-slot:counter>
          <q-btn
            :label="$t('Forgot password?')"
            flat
            dense
            color="accent"
            @click="$emit('show-reset-password')"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions>
      <!-- <div v-if="!!errors.error" class="q-body-1 uppercase text-center full-width">
        {{ `${errors.error.name}: ${errors.error.message}` }}
      </div>-->
      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <q-btn
            :label="$t('Sign in')"
            color="primary"
            class="full-width"
            :disable="$v.$invalid"
            :loading="pending"
            @click="emitSignIn"
          />
        </div>
        <div class="col-6">
          <q-btn
            color="google"
            class="row full-width"
            :disable="disableGoogle"
            @click="$emit('google')"
          >
            <q-icon
              class="col-auto"
              name="fab fa-google"
            />
            <div class="col">
              Google
            </div>
          </q-btn>
        </div>
        <div class="col-6">
          <q-btn
            color="facebook"
            class="row full-width"
            :disable="disableFacebook"
            @click="$emit('facebook')"
          >
            <q-icon
              class="col-auto"
              name="fab fa-facebook-f"
            />
            <div class="col">
              Facebook
            </div>
          </q-btn>
        </div>
        <div class="col-6">
          <q-btn
            color="line"
            class="row full-width"
            :disable="disableLine"
            @click="$emit('line')"
          >
            <q-icon
              class="col-auto"
              name="img:assets/icons/line-icon-97.png"
            />
            <div class="col">
              LINE
            </div>
          </q-btn>
        </div>
        <div class="col-6">
          <q-btn
            color="twitter"
            class="row full-width"
            :disable="disableTwitter"
            @click="$emit('twitter')"
          >
            <q-icon
              class="col-auto"
              name="fab fa-twitter"
            />
            <div class="col">
              Twitter
            </div>
          </q-btn>
        </div>
      </div>
    </q-card-actions>
    <q-card-section>
      <div class="text-body1 uppercase text-center full-width">
        {{ $t('Need an account?') }}
        <q-btn
          :label="$t('Sign up')"
          flat
          dense
          color="accent"
          @click="$emit('show-sign-up')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
// import Logger from 'assets/logger'
// const logger = new Logger('user.SignIn')
import { required, email, minLength } from 'vuelidate/lib/validators'
import { apiErrors } from 'assets/validators'

export default {
  name: 'SignIn',
  props: {
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    errors: {
      type: Object,
      default () {
        return {}
      }
    },
    pending: {
      type: Boolean,
      default: false
    },
    disableGoogle: {
      type: Boolean,
      default: false
    },
    disableFacebook: {
      type: Boolean,
      default: false
    },
    disableLine: {
      type: Boolean,
      default: false
    },
    disableTwitter: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    email: {
      required,
      email,
      apiErrors: apiErrors('email')
    },
    password: {
      required,
      minLength: minLength(8),
      apiErrors: apiErrors('password')
    }
  },
  data () {
    return {}
  },
  methods: {
    emitSignIn () {
      if (!this.$v.$error) {
        this.$v.$reset()
        this.$emit('sign-in')
      }
    },
    errorMessages (vState) {
      if (!vState.$error) {
        return ''
      }
      for (let type in vState.$params) {
        if (!vState[type]) {
          if (type === 'apiErrors') {
            return this.$t(this.errors[vState.$params[type].field])
          } else {
            return this.$t(type, vState.$params[type])
          }
        }
      }
    }
  }
}
</script>

<style>
.text-google {
  color: #dd4b39;
}
.bg-google {
  background: #dd4b39;
}
.text-facebook {
  color: #4b70ab;
}
.bg-facebook {
  background: #4b70ab;
}
.text-twitter {
  color: #3b94d9;
}
.bg-twitter {
  background: #3b94d9;
}
.text-line {
  color: #00c300;
}
.bg-line {
  background: #00c300;
}
/* $social-list: (
    facebook #4b70ab,
    linkedin #0087be,
    google #3F85F4,
    twitter #3B94D9,
    yahoo #500095,
    openid #F78C40,
    googleplus #DD4B39,
    dropbox #007DE1,
    github #333,
    bitbucket #205081,
    soundcloud #FF5500,
    spotify #2EBD59,
    microsoft #00A4EF,
    flickr #FF0084
); */
</style>
