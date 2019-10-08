<template>
  <q-card
    flat
    class="verify-email-card"
    color="white"
    text-color="dark"
  >
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">
            {{ $t('Email verification') }}
          </div>
        </div>
        <div class="col-auto text-h5">
          <q-icon name="verified_user" />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        type="textarea"
        :label="$t('Verification token')"
        :value="token"
        clearable
        :error="$v.token.$error"
        :error-message="errorMessages($v.token)"
        bottom-slots
        autocomplete="token"
        @blur="$v.token.$touch"
        @input="$emit('update:token', $event)"
        @keyup.enter="emitVerifyEmail"
      >
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
        <!-- <template v-slot:append>
          <q-icon
            v-if="token !== ''"
            name="close"
            class="cursor-pointer"
            @click="token = ''"
          />
        </template> -->
      </q-input>
    </q-card-section>
    <q-card-actions
      vertical
      align="between"
    >
      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <q-btn
            :label="$t('Send verification token')"
            color="positive"
            class="full-width"
            :disable="$v.$invalid"
            :loading="pending"
            @click="emitVerifyEmail"
          />
        </div>
      </div>
    </q-card-actions>
    <q-card-section>
      <div class="text-body1 uppercase text-center full-width">
        {{ $t("Didn't receive email?") }}
        <q-btn
          :label="$t('Resend verification link')"
          flat
          dense
          color="info"
          @click="$emit('send-verification')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { apiErrors } from 'assets/validators'

export default {
  name: 'VerifyEmailCard',
  props: {
    token: {
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
  data () {
    return {}
  },
  validations: {
    token: {
      required,
      apiErrors: apiErrors('verify-email')
    }
  },
  methods: {
    emitVerifyEmail () {
      if (!this.$v.$error) {
        this.$v.$reset()
        this.$emit('verify-email')
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
