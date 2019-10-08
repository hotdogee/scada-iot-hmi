<template>
  <q-card
    flat
    class="user-form"
  >
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">
            {{ $t('Sign up') }}
          </div>
        </div>
        <div class="col-auto text-h5">
          <q-icon name="person_add" />
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
        @keyup.enter="emitSignUp"
      >
        <template v-slot:prepend>
          <q-icon name="alternate_email" />
        </template>
        <!-- <template v-slot:append>
          <q-icon
            v-if="email !== ''"
            name="close"
            @click="email = ''"
            class="cursor-pointer"
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
        autocomplete="new-password"
        @blur="$v.password.$touch"
        @input="$emit('update:password', $event)"
        @keyup.enter="emitSignUp"
      >
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
        <!-- <template v-slot:append>
          <q-icon
            v-if="password !== ''"
            name="close"
            @click="password = ''"
            class="cursor-pointer"
          />
        </template>-->
      </q-input>
      <vue-recaptcha
        ref="recaptcha"
        size="invisible"
        badge="inline"
        :sitekey="sitekey"
        @verify="onVerify"
        @expired="onExpired"
      ></vue-recaptcha>
    </q-card-section>
    <q-card-actions class="row q-col-gutter-sm">
      <div class="full-width">
        <div class="col-12">
          <q-btn
            :label="$t('Sign up')"
            color="primary"
            class="full-width"
            :disable="$v.$invalid"
            :loading="pending"
            @click="emitSignUp"
          />
        </div>
      </div>
    </q-card-actions>
    <q-card-section>
      <div class="text-body1 uppercase text-center full-width">
        {{ $t('Have an account?') }}
        <q-btn
          :label="$t('Sign in')"
          flat
          dense
          color="secondary"
          @click="$emit('show-sign-in')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import Logger from 'assets/logger'
const logger = new Logger('user.SignUp')
import { required, email, minLength } from 'vuelidate/lib/validators'
import { apiErrors } from 'assets/validators'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'SignUp',
  components: { VueRecaptcha },
  props: {
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    recaptchaToken: {
      type: String,
      default: ''
    },
    sitekey: {
      type: String,
      default: process.env.RECAPTCHA_SITE_KEY
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
    emitSignUp () {
      if (!this.$v.$error) {
        this.$refs.recaptcha.execute()
      }
    },
    onVerify (response) {
      logger.log('Verify: ' + response)
      this.$v.$reset()
      this.$refs.recaptcha.reset()
      this.$emit('update:recaptchaToken', response)
      this.$emit('sign-up')
    },
    onExpired () {
      logger.log('Expired')
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
.grecaptcha-badge {
  display: none;
}
</style>
