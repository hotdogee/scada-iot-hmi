<template>
  <q-page class="row q-pa-xs">
    <div class="col-xs-12">
      <div class="m-1 min-h-screen rounded-sm bg-white dark:bg-gray-950">
        <!-- Hero Section -->
        <section
          class="relative rounded-sm bg-gradient-to-b from-amber-50 to-background py-16 pt-20 md:py-24 dark:from-amber-950 dark:to-background"
        >
          <div class="container mx-auto px-4 md:px-6">
            <div class="grid items-center gap-6 max-lg:text-center lg:grid-cols-2 xl:px-24">
              <div class="space-y-4">
                <div
                  class="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1 text-base font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                  Get in Touch
                </div>
                <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Contact Us
                </h1>
                <div class="text-muted-foreground md:text-xl/relaxed lg:max-w-[600px]">
                  Get in touch with the SCADA/IoT team for support, collaboration, or inquiries
                </div>
              </div>
              <div class="flex justify-center lg:justify-end">
                <div
                  class="relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-lg bg-amber-100 md:h-[400px] md:w-[400px] dark:bg-amber-900"
                >
                  <img src="~assets/contact-illustration-1.jpg" alt="About Page Illustration" />
                  <div
                    class="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent dark:from-amber-400/20"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Profile Card -->
        <section class="bg-white px-4 pb-12 sm:px-6 lg:px-8 dark:bg-gray-950">
          <div class="mx-auto max-w-7xl">
            <div
              class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="p-6 sm:p-8 md:p-10">
                <div class="flex flex-col items-center md:flex-row md:items-start">
                  <div class="mb-6 flex-shrink-0 md:mr-8 md:mb-0">
                    <div
                      class="h-32 w-32 overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900"
                    >
                      <img
                        src="~assets/contact-profile.jpg"
                        alt="Han Lin"
                        class="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div class="text-center md:text-left!">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Han Lin</h2>
                    <div class="text-lg text-gray-600 dark:text-gray-300">Research Engineer</div>
                  </div>
                </div>

                <div class="mt-8">
                  <h3 class="mb-4 text-xl font-semibold text-amber-600 dark:text-amber-400">
                    About Me
                  </h3>
                  <!-- <QMarkdown :src="LinkedinSummary" /> -->
                  <!-- prettier-ignore -->
                  <QMarkdown class="space-y-4 text-base text-gray-600 dark:text-gray-300">
Driven by a lifelong fascination with AI and a deep curiosity about how things work – from fundamental physics to complex biological systems – I engineer innovative solutions where hardware, software, and scientific theory intersect.

My unique background allows me to:

- **Architect & Build Full-Stack Systems:** From designing custom PCBs and novel hardware (like geothermal turbines yielding \+50% efficiency) to developing sophisticated AI models (achieving 90% accuracy & 100x speedup in protein analysis) and deploying robust cloud-native applications (IoT, SCADA, EMRs).
- **Accelerate R\&D:** I thrive on tackling previously intractable problems, optimizing performance, and creating bespoke tools that empower researchers and engineers.
- **Master & Apply Cutting-Edge Tech:** Continuously learning and recently certified across multiple cloud platforms (GCP, Azure, AWS), AI/ML disciplines, and cybersecurity, ensuring solutions are modern, scalable, and secure.

With experience spanning sustainable energy, biotech, healthcare, and bioinformatics, I excel at understanding complex requirements and translating them into tangible, high-impact results.

I grew up in Iowa and am now based in Taiwan; I’ve worked across diverse environments—from the National Agriculture Library in Maryland to leading research initiatives in Taipei. My multicultural background has shaped my collaborative mindset and adaptability.

I'm passionate about pushing the boundaries of what's possible and am seeking challenging opportunities to contribute to world-class research or groundbreaking engineering projects.

I’m here to connect with innovators, researchers, and teams who share my vision of pushing human knowledge forward.

Let’s build something groundbreaking together! 🚀
                </QMarkdown>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Information -->
        <section class="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
          <div class="mx-auto max-w-7xl">
            <h2 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Contact Information
            </h2>

            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="space-y-6">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                      >
                        <Mail class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                      <div class="mt-1 space-y-1 text-base">
                        <a
                          href="mailto:hanlin@ntu.edu.tw"
                          class="text-amber-600 hover:underline dark:text-amber-400"
                        >
                          hanlin@ntu.edu.tw
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                      >
                        <LinkIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Let's Connect
                      </h3>
                      <div class="mt-1 text-base">
                        <div class="mt-8 flex space-x-4 lg:mt-0 lg:flex-shrink-0">
                          <a
                            href="https://github.com/hotdogee/scada-iot-hmi"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center justify-center rounded-full p-3 text-gray-500 transition-colors duration-200 hover:bg-amber-100 hover:text-amber-600 dark:bg-amber-900 dark:hover:bg-amber-950"
                            aria-label="GitHub"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                              ></path>
                            </svg>
                          </a>
                          <a
                            href="https://www.linkedin.com/in/hotdogee"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center justify-center rounded-full p-3 text-gray-500 transition-colors duration-200 hover:bg-amber-100 hover:text-amber-600 dark:bg-amber-900 dark:hover:bg-amber-950"
                            aria-label="LinkedIn"
                          >
                            <svg
                              fill="currentColor"
                              class="h-6 w-6"
                              version="1.1"
                              id="Layer_1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              viewBox="0 0 310 310"
                              xml:space="preserve"
                            >
                              <g id="XMLID_801_">
                                <path
                                  id="XMLID_802_"
                                  d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
		C77.16,101.969,74.922,99.73,72.16,99.73z"
                                />
                                <path
                                  id="XMLID_803_"
                                  d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
		c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
                                />
                                <path
                                  id="XMLID_804_"
                                  d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
		c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
		c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
		C310,145.43,300.549,94.761,230.454,94.761z"
                                />
                              </g>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="space-y-6">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                      >
                        <School class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Education</h3>
                      <div class="mt-1 space-y-2 text-base">
                        <div>
                          <p class="text-gray-600 dark:text-gray-300">
                            Ph.D. Candidate, Biomedical Electronics and Bioinformatics
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            <a href="https://www.ntu.edu.tw/english/">National Taiwan University</a>
                          </p>
                        </div>
                        <div>
                          <p class="text-gray-600 dark:text-gray-300">
                            M.S., Electronic Design Automation
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            <a href="https://www.ntu.edu.tw/english/">National Taiwan University</a>
                          </p>
                        </div>
                        <div>
                          <p class="text-gray-600 dark:text-gray-300">
                            B.S., Electronics Engineering
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            <a href="https://www.nycu.edu.tw/nycu/en/index"
                              >National Chiao Tung University</a
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Areas of Expertise -->
        <section class="bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
          <div class="mx-auto max-w-7xl">
            <h2 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Areas of Expertise
            </h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:translate-y-[-4px] hover:transform dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-4 flex items-center">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                  >
                    <Brain class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                    Artificial Intelligence
                  </h3>
                </div>
                <p class="text-base text-gray-600 dark:text-gray-300">
                  Deep Learning, Machine Learning, Neural Networks, TensorFlow, Computer Vision,
                  MLOps
                </p>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:translate-y-[-4px] hover:transform dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-4 flex items-center">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                  >
                    <Flask class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                    Bioinformatics
                  </h3>
                </div>
                <p class="text-base text-gray-600 dark:text-gray-300">
                  Next Generation Sequencing, Proteomics, RNAseq, Microarray Analysis, Molecular
                  Biology
                </p>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:translate-y-[-4px] hover:transform dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-4 flex items-center">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
                  >
                    <Cloud class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                    Cloud Technologies
                  </h3>
                </div>
                <p class="text-base text-gray-600 dark:text-gray-300">
                  Google Cloud Platform, AWS, Azure, Cloud Architecture, DevOps, Security
                  Engineering
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Form -->
        <section class="rounded-sm bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
          <div class="mx-auto max-w-3xl">
            <div
              class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="p-6 sm:p-8">
                <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Send a Message
                </h2>
                <div class="mb-6 text-base text-gray-600 dark:text-gray-300">
                  Feel free to reach out if you have any questions or would like to discuss
                  potential collaborations.
                </div>

                <div
                  v-if="formStatus"
                  :class="`mb-6 rounded-md p-4 ${
                    formStatus.success
                      ? 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`"
                  role="alert"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <CheckCircle2
                        v-if="formStatus.success"
                        class="h-5 w-5 text-green-500 dark:text-green-400"
                      />
                      <AlertCircle v-else class="h-5 w-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div class="ml-3">
                      <p
                        :class="`text-sm ${
                          formStatus.success
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-800 dark:text-red-300'
                        }`"
                      >
                        {{ formStatus.message }}
                      </p>
                    </div>
                  </div>
                </div>
                <q-form @submit="onSubmit" class="space-y-4">
                  <div class="grid grid-cols-1 gap-6 gap-y-4 sm:grid-cols-2">
                    <q-input
                      outlined
                      type="text"
                      id="name"
                      label="Name"
                      v-model="formState.name"
                      aria-required="true"
                      lazy-rules="ondemand"
                      :rules="[(val) => !!val || 'Name is required']"
                    >
                      <template v-slot:prepend>
                        <CircleUserRound />
                      </template>
                    </q-input>
                    <q-input
                      outlined
                      type="text"
                      id="email"
                      label="Email"
                      v-model="formState.email"
                      aria-required="true"
                      lazy-rules="ondemand"
                      :rules="[
                        (val) => !!val || 'Email is required',
                        (val) =>
                          /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) ||
                          'Please enter a valid email address'
                      ]"
                    >
                      <template v-slot:prepend>
                        <AtSign />
                      </template>
                    </q-input>
                  </div>
                  <q-input
                    outlined
                    type="textarea"
                    id="message"
                    label="Message"
                    v-model="formState.message"
                    aria-required="true"
                    lazy-rules="ondemand"
                    :rules="[(val) => !!val || 'Message is required']"
                  >
                    <template v-slot:prepend>
                      <MessageSquareText />
                    </template>
                  </q-input>
                  <q-btn
                    type="submit"
                    class="full-width"
                    color="amber-8"
                    size="lg"
                    :loading="isLoading"
                    aria-label="Send message"
                  >
                    <div
                      class="inline-flex items-center justify-center rounded-lg text-base font-medium"
                    >
                      <SendHorizontal class="mr-3" />
                      Send Message
                    </div>
                  </q-btn>
                </q-form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  AtSign,
  Brain,
  CheckCircle2,
  CircleUserRound,
  Cloud,
  FlaskRoundIcon as Flask,
  LinkIcon,
  Mail,
  MessageSquareText,
  School,
  SendHorizontal
} from 'lucide-vue-next'
import { reactive, ref } from 'vue'

const formState = reactive({
  name: '',
  email: '',
  subject: 'SCADA/IoT User Inquiry',
  message: ''
})

const formStatus = ref<null | { success: boolean; message: string }>(null)
const isLoading = ref(false)

const onSubmit = async () => {
  // @submit is emitted only when all validations have passed
  try {
    isLoading.value = true
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbx0Qv17Ym5VNL-dHyeJT_uyLWKkepHGEDPUoUMYy-PZ9ZLTdx1ouu2BQ4QukgEjSP48cQ/exec',
      {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(formState)
      }
    )
    // console.log(JSON.stringify(formState))
    // console.log(response)
    // Handle success and error
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    if (data.result === 'success') {
      formStatus.value = {
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!"
      }
      // Reset form after successful submission
      formState.name = ''
      formState.email = ''
      formState.message = ''
    } else {
      throw new Error('Failed to send message', data.error)
    }
  } catch (error) {
    console.error('Error sending message:', error)
    formStatus.value = {
      success: false,
      message: 'There was an error sending your message. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Any additional component-specific styles can be added here */
/* Most styling is handled by Tailwind CSS classes in the template */
</style>
