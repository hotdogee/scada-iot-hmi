<template>
  <q-card
    flat
    class="user-form"
  >
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">
            {{ $t('Reset Password') }}
          </div>
        </div>
        <div class="col-auto text-h5">
          <q-icon name="lock" />
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
        @blur="$v.email.$touch"
        @input="$emit('update:email', $event)"
        @keyup.enter="emitResetPassword"
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
    </q-card-section>
    <q-card-actions class="row q-col-gutter-sm">
      <div class="full-width">
        <div class="col-12">
          <q-btn
            :label="$t('Reset password')"
            color="primary"
            class="full-width"
            :disable="$v.$invalid"
            :loading="pending"
            @click="emitResetPassword"
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
// import Logger from 'assets/logger'
// const logger = new Logger('user.ResetPassword')
import { required, email } from 'vuelidate/lib/validators'
import { apiErrors } from 'assets/validators'

export default {
  name: 'ResetPassword',
  props: {
    email: {
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
    }
  },
  validations: {
    email: {
      required,
      email,
      apiErrors: apiErrors('email')
    }
  },
  data () {
    return {}
  },
  methods: {
    emitResetPassword () {
      if (!this.$v.$error) {
        this.$v.$reset()
        this.$emit('reset-password')
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

<style></style>
