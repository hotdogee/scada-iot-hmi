<template>
  <q-card
    flat
    class="user-form"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="displayAvatar" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ displayName }}</q-item-label>
        <q-item-label
          caption
        >
          {{ email }}
          <q-badge
            v-if="!email_verified"
            color="primary"
          >
            {{ $t('Unverified') }}
          </q-badge>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-actions class="row q-col-gutter-sm">
      <div class="col-4 offset-8">
        <q-btn
          :label="$t('Sign out')"
          color="blue-grey-4"
          text-color="blue-grey-4"
          class="full-width"
          outline
          :disable="$v.$invalid"
          :loading="pending"
          @click="emitSignOut"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
// import Logger from 'assets/logger'
// const logger = new Logger('user.ResetPassword')
// import { required, email } from 'vuelidate/lib/validators'
// import { apiErrors } from 'assets/validators'

export default {
  name: 'SignOut',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    accountSelected: {
      type: Number,
      default: 0
    },
    accounts: {
      type: Array,
      default () {
        return [{ type: 'email', value: 'noemail@gmail.com' }]
      }
    },
    authorizationSelected: {
      type: Number,
      default: 0
    },
    authorizations: {
      type: Array,
      default () {
        return []
      }
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
  validations: {},
  data () {
    return {}
  },
  computed: {
    displayName () {
      return this.name || 'Unknown Name'
    },
    displayAvatar () {
      return this.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'
    }
  },
  methods: {
    emitSignOut () {
      if (!this.$v.$error) {
        this.$v.$reset()
        this.$emit('sign-out')
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
