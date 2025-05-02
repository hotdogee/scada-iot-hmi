<template>
  <q-page class="row q-pa-xs">
    <div class="col-xs-12">
      <div
        class="about m-1 min-h-screen rounded-sm bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100"
      >
        <main>
          <!-- Hero Section -->
          <section
            class="relative rounded-sm bg-gradient-to-b from-emerald-50 to-background pt-10 md:pt-15 dark:from-emerald-950 dark:to-background"
          >
            <div class="container mx-auto px-4 md:px-6">
              <div class="grid items-center gap-6 max-lg:text-center lg:grid-cols-2 xl:px-24">
                <div class="space-y-4">
                  <div
                    class="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-base font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    Powering Insight
                  </div>
                  <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    SCADA/IoT Project
                  </h1>
                  <div class="text-muted-foreground md:text-xl/relaxed lg:max-w-[600px]">
                    A flexible, cost-effective solution bridging industrial control and modern web
                    technologies
                  </div>
                  <div class="flex flex-col gap-4 max-lg:justify-center sm:flex-row">
                    <RouterLink
                      :to="{ name: 'about', hash: '#features' }"
                      class="rounded-lg bg-emerald-600 px-8 py-3 font-medium text-white shadow-lg transition-colors hover:bg-emerald-700 hover:shadow-xl"
                    >
                      Explore Features
                    </RouterLink>
                    <RouterLink
                      :to="{ name: 'about', hash: '#case-study' }"
                      class="rounded-lg border border-gray-200 bg-emerald-100 bg-white px-8 py-3 font-medium text-emerald-700 shadow-lg transition-colors hover:bg-emerald-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      View Case Study
                    </RouterLink>
                  </div>
                </div>
                <div class="flex justify-center lg:justify-end">
                  <div
                    class="relative flex items-center justify-center overflow-hidden rounded-lg bg-emerald-100 sm:h-[400px] sm:w-[400px] dark:bg-emerald-900"
                  >
                    <img src="~assets/about-illustration-1.jpg" alt="About Page Illustration" />
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent dark:from-emerald-400/20"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Introduction Section -->
          <section id="introduction" class="bg-white py-16 dark:bg-gray-900">
            <div class="container mx-auto px-4">
              <div class="mx-auto max-w-7xl text-center">
                <h2 class="text-base font-semibold tracking-wide text-emerald-600 uppercase">
                  Overview
                </h2>
                <div
                  class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                >
                  Bridging SCADA and IoT for Advanced Monitoring
                </div>
                <div class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  This project represents a leap forward in industrial monitoring and control,
                  specifically developed for Taiwan's cutting-edge geothermal power pilot project
                  operated by Lanyang Geothermal Corp. It's a modern SCADA (Supervisory Control and
                  Data Acquisition) system infused with IoT (Internet of Things) principles.
                </div>
                <div class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Our mission was to create a system that not only meets the demanding requirements
                  of a research-grade geothermal power plant but also provides a blueprint for
                  next-generation industrial automation – moving away from costly, proprietary
                  solutions towards open, scalable, and web-centric technologies.
                </div>
              </div>
            </div>
          </section>

          <!-- Challenge Section -->
          <section id="challenge" class="bg-gray-50 py-16 dark:bg-gray-800">
            <div class="container mx-auto px-4">
              <h2
                class="text-center text-base font-semibold tracking-wide text-emerald-600 uppercase"
              >
                The Challenge
              </h2>
              <div
                class="mt-2 mb-10 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Limitations of Traditional Systems
              </div>
              <div class="grid gap-8 md:grid-cols-3">
                <div
                  v-for="(challenge, index) in challenges"
                  :key="index"
                  class="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-900"
                >
                  <div class="mb-4 flex items-center">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
                    >
                      <component :is="challenge.icon" class="h-6 w-6 text-red-500" />
                    </div>
                    <h3 class="ml-3 text-xl font-semibold">
                      {{ challenge.title }}
                    </h3>
                  </div>
                  <div class="text-gray-600 dark:text-gray-300">{{ challenge.description }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Architecture Section -->
          <div id="architecture" class="bg-gray-50 py-12">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div class="lg:text-center">
                <h2 class="text-base font-semibold tracking-wide text-emerald-600 uppercase">
                  Our Solution
                </h2>
                <div
                  class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                >
                  A Modern, Distributed SCADA/IoT Architecture
                </div>
                <div class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  We developed a distributed system that leverages the strengths of both traditional
                  industrial control and modern web/IoT technologies.
                </div>
              </div>

              <div class="mt-10">
                <div class="overflow-hidden rounded-lg bg-white shadow">
                  <div class="grid gap-6 px-4 py-5 sm:p-6 lg:grid-cols-2">
                    <img
                      src="~assets/about-illustration-2.jpg"
                      alt="System Architecture Diagram"
                      class="w-full"
                    />

                    <div class="mt-8 grid grid-cols-1 gap-8">
                      <div class="border-t-4 border-emerald-500 pt-4">
                        <h3 class="text-lg font-medium text-gray-900">Universal HMI</h3>
                        <div class="mt-2 text-base text-gray-500">
                          A responsive, cross-platform Human-Machine Interface built with Vue
                          3/Quasar acts as a Progressive Web App (PWA). It delivers real-time
                          dashboards, powerful historical data visualization, camera feeds, and
                          control capabilities to any device.
                        </div>
                      </div>
                      <div class="border-t-4 border-emerald-500 pt-4">
                        <h3 class="text-lg font-medium text-gray-900">Scalable Supervisor</h3>
                        <div class="mt-2 text-base text-gray-500">
                          A central backend built on Node.js/FeathersJS aggregates data, manages a
                          high-performance time-series database (MongoDB), calculates derived
                          values, handles secure authentication, and serves data via robust APIs.
                        </div>
                      </div>
                      <div class="border-t-4 border-emerald-500 pt-4">
                        <h3 class="text-lg font-medium text-gray-900">Software-Defined PLC</h3>
                        <div class="mt-2 text-base text-gray-500">
                          Using readily available hardware like Raspberry Pi running Node.js, we
                          created flexible edge controllers capable of direct device communication
                          (Modbus RTU), local data processing, and control logic execution.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <section id="features" class="bg-gray-50 py-16 dark:bg-gray-800">
            <div class="container mx-auto px-4">
              <h2
                class="text-center text-base font-semibold tracking-wide text-emerald-600 uppercase"
              >
                Features
              </h2>
              <div
                class="mt-2 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Key Features & Capabilities
              </div>
              <div class="mt-4 mb-10 max-w-3xl text-center text-xl text-gray-500 lg:mx-auto">
                Our system provides powerful capabilities that transform how industrial processes
                are monitored and controlled.
              </div>

              <div class="grid gap-8 md:grid-cols-2">
                <div
                  v-for="(feature, index) in features"
                  :key="index"
                  class="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-900"
                >
                  <div class="mb-4 flex items-center">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
                    >
                      <component :is="feature.icon" class="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 class="ml-3 text-xl font-semibold">
                      {{ feature.title }}
                    </h3>
                  </div>
                  <div class="mb-4 text-gray-600 dark:text-gray-300">{{ feature.benefit }}</div>
                  <ul class="space-y-2">
                    <li v-for="(item, i) in feature.items" :key="i" class="flex items-start">
                      <CheckIcon class="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span class="text-gray-600 dark:text-gray-300">{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Technology Stack -->
          <section id="technology" class="bg-white py-16 dark:bg-gray-900">
            <div class="container mx-auto px-4">
              <h2
                class="text-center text-base font-semibold tracking-wide text-emerald-600 uppercase"
              >
                Technology
              </h2>
              <div
                class="mt-2 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Modern Technology Stack
              </div>
              <div class="mt-4 mb-10 max-w-3xl text-center text-xl text-gray-500 lg:mx-auto">
                Our system leverages modern technologies across hardware and software to deliver a
                powerful, flexible solution.
              </div>

              <div class="grid gap-12 md:grid-cols-2">
                <div>
                  <h3 class="mb-4 flex items-center text-2xl font-semibold">
                    <CpuIcon class="mr-2 h-6 w-6 text-emerald-500" />
                    Hardware
                  </h3>
                  <ul class="space-y-2 pl-1">
                    <li
                      v-for="(item, index) in techStack.hardware"
                      :key="index"
                      class="flex items-start"
                    >
                      <ChevronRightIcon class="mr-2 h-6 w-6 flex-shrink-0 text-emerald-400" />
                      <span class="text-gray-600 dark:text-gray-300">{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="mb-4 flex items-center text-2xl font-semibold">
                    <CodeXmlIcon class="mr-2 h-6 w-6 text-emerald-500" />
                    Software
                  </h3>
                  <ul class="space-y-2 pl-1">
                    <li
                      v-for="(item, index) in techStack.software"
                      :key="index"
                      class="flex items-start"
                    >
                      <ChevronRightIcon class="mr-2 h-6 w-6 flex-shrink-0 text-emerald-400" />
                      <span class="text-gray-600 dark:text-gray-300"
                        ><strong>{{ item.split(':')[0] }}:</strong> {{ item.split(':')[1] }}</span
                      >
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-12">
                <h3 class="mb-4 flex items-center text-2xl font-semibold">
                  <NetworkIcon class="mr-2 h-5 w-5 text-emerald-500" />
                  Communication Protocols
                </h3>
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="(protocol, index) in techStack.protocols"
                    :key="index"
                    class="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    {{ protocol }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Case Study Section -->
          <section id="case-study" class="bg-gray-50 py-16 dark:bg-gray-800">
            <div class="container mx-auto px-4 md:px-6">
              <div class="grid items-center gap-6 max-lg:text-center lg:grid-cols-2 xl:px-24">
                <div class="space-y-4">
                  <div
                    class="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-base font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    Case Study
                  </div>
                  <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Proven in the Field:<br />Total Flow Pilot Project
                  </h1>
                  <div class="text-muted-foreground md:text-xl/relaxed lg:max-w-[600px]">
                    This SCADA/IoT system was the central nervous system for the Total Flow
                    geothermal power generation pilot project in Yilan, Taiwan. This project aimed
                    to harness energy from both steam and brine, a departure from traditional
                    methods.
                  </div>
                </div>
                <div class="flex justify-center lg:justify-end">
                  <div
                    class="relative flex items-center justify-center overflow-hidden rounded-lg bg-emerald-100 sm:h-[400px] sm:w-[400px] dark:bg-emerald-900"
                  >
                    <img src="~assets/about-illustration-3.jpg" alt="About Page Illustration" />
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent dark:from-emerald-400/20"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container mx-auto px-4">
              <div class="mt-16">
                <div class="overflow-hidden rounded-lg bg-white shadow">
                  <div class="px-4 py-5 sm:p-6">
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Project Impact</h3>
                        <div class="mt-4 text-base text-gray-500">
                          <ul class="ml-4 list-disc space-y-4">
                            <li>
                              <strong>Enabled Research & Optimization:</strong> Provided critical
                              real-time data needed to analyze and optimize the novel Total Flow
                              process.
                            </li>
                            <li>
                              <strong>Quantifiable Performance Improvements:</strong>
                              <ul class="mt-2 ml-4 list-disc">
                                <li>
                                  Helped identify inefficiencies (e.g., ineffective surge tank,
                                  suboptimal generator connections)
                                </li>
                                <li>
                                  Facilitated optimizations leading to a recorded power output
                                  increase from
                                  <span class="font-bold text-emerald-600">70kW to 180kW</span>
                                  under the same well conditions
                                </li>
                                <li>
                                  Turbine height adjustment guided by system data resulted in a
                                  <span class="font-bold text-emerald-600"
                                    >250% power increase</span
                                  >
                                </li>
                              </ul>
                            </li>
                            <li>
                              <strong>Cost Savings:</strong> Direct factory sourcing guided by
                              system requirements led to significant cost reductions on components
                              (e.g., Generator:
                              <span class="font-bold text-emerald-600">-70%</span>, Flow Meter:
                              <span class="font-bold text-emerald-600">-80%</span>, RTU/PLC:
                              <span class="font-bold text-emerald-600">-90%</span>)
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                          Technical Achievements
                        </h3>
                        <div class="mt-4 text-base text-gray-500">
                          <ul class="ml-4 list-disc space-y-4">
                            <li>
                              <strong>Successful Testing:</strong> Supported load bank tests (up to
                              <span class="font-bold text-emerald-600">192kW</span>) and stable
                              grid-tie synchronization tests (<span
                                class="font-bold text-emerald-600"
                                >150kW</span
                              >
                              demonstrated)
                            </li>
                            <li>
                              <strong>Operational Efficiency:</strong> Enabled remote monitoring and
                              operation of the unmanned test site via web dashboards and camera
                              feeds, reducing personnel requirements
                            </li>
                            <li>
                              <strong>Data Handling:</strong> Successfully managed high-frequency
                              data from
                              <span class="font-bold text-emerald-600">>100 sensors</span> and
                              enabled analysis of large historical datasets (<span
                                class="font-bold text-emerald-600"
                                >>1 billion points</span
                              >)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <!-- Performance Metrics Visualization -->
                    <div class="mt-8">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Performance Metrics
                      </h3>
                      <div class="mt-4">
                        <div class="rounded-lg bg-gray-50 p-4">
                          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <!-- Metric 1 -->
                            <div
                              class="rounded-lg border bg-white p-4 shadow hover:border-emerald-500"
                            >
                              <div class="flex items-center">
                                <div class="flex-shrink-0 rounded-md bg-emerald-100 p-3">
                                  <ZapIcon class="h-8 w-8 text-emerald-600" />
                                </div>
                                <div class="ml-4">
                                  <h4 class="text-lg font-medium text-gray-900">Power Increase</h4>
                                  <p class="text-3xl font-bold text-emerald-600">250%</p>
                                </div>
                              </div>
                              <p class="mt-2 text-sm text-gray-500">
                                Achieved by raising the turbine-generator module
                              </p>
                            </div>

                            <!-- Metric 2 -->
                            <div
                              class="rounded-lg border bg-white p-4 shadow hover:border-emerald-500"
                            >
                              <div class="flex items-center">
                                <div class="flex-shrink-0 rounded-md bg-emerald-100 p-3">
                                  <DollarSignIcon class="h-8 w-8 text-emerald-600" />
                                </div>
                                <div class="ml-4">
                                  <h4 class="text-lg font-medium text-gray-900">Cost Reduction</h4>
                                  <p class="text-3xl font-bold text-emerald-600">Up to 90%</p>
                                </div>
                              </div>
                              <p class="mt-2 text-sm text-gray-500">
                                Through direct factory sourcing and component selection
                              </p>
                            </div>

                            <!-- Metric 3 -->
                            <div
                              class="rounded-lg border bg-white p-4 shadow hover:border-emerald-500"
                            >
                              <div class="flex items-center">
                                <div class="flex-shrink-0 rounded-md bg-emerald-100 p-3">
                                  <TrendingUpIcon class="h-8 w-8 text-emerald-600" />
                                </div>
                                <div class="ml-4">
                                  <h4 class="text-lg font-medium text-gray-900">Data Points</h4>
                                  <p class="text-3xl font-bold text-emerald-600">1B+</p>
                                </div>
                              </div>
                              <p class="mt-2 text-sm text-gray-500">
                                Visualized and analyzed with the system
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Project Gallery -->
                    <div class="mt-8">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Project Gallery: SCADA/IoT in Action
                      </h3>
                      <div class="mt-4 overflow-hidden">
                        <div
                          class="mx-auto overflow-hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                        >
                          <q-carousel
                            animated
                            thumbnails
                            arrows
                            class="overflow-hidden md:aspect-[1/1]"
                            height="100%"
                            v-model="slide"
                            infinite
                            control-color="blue-grey-1"
                            control-text-color="blue-grey-8"
                            control-type="unelevated"
                            :autoplay="autoplay"
                            transition-prev="slide-right"
                            transition-next="slide-left"
                            @mouseenter="autoplay = false"
                            @mouseleave="autoplay = true"
                          >
                            <q-carousel-slide
                              v-for="i in 9"
                              :key="i"
                              :name="`photo-${i}`"
                              class="column no-wrap overflow-hidden bg-white"
                              fit="contain"
                              :img-src="`src/assets/about-photo-${i}.jpg`"
                            >
                              <div
                                class="row fit no-wrap flex items-center justify-start max-md:mb-17 max-md:min-h-(--breakpoint-md) max-sm:min-h-(--breakpoint-sm) md:px-12 md:pt-24 md:pb-17"
                              >
                                <q-img
                                  fit="contain"
                                  class="rounded-borders fit"
                                  :src="`src/assets/about-photo-${i}.jpg`"
                                />
                                <div
                                  class="absolute top-4 right-0 left-0 bg-white/50 text-center text-slate-700 md:px-12"
                                >
                                  <div
                                    class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                                  >
                                    {{ photos[i - 1]?.title }}
                                  </div>
                                  <div class="text-base">{{ photos[i - 1]?.description }}</div>
                                </div>
                              </div>
                            </q-carousel-slide>
                            <template v-slot:control>
                              <q-carousel-control position="bottom-right" :offset="[18, 18]">
                              </q-carousel-control>
                            </template>
                          </q-carousel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- USP Section -->
          <section id="usp" class="bg-white py-16 dark:bg-gray-900">
            <div class="container mx-auto px-4">
              <h2
                class="text-center text-base font-semibold tracking-wide text-emerald-600 uppercase"
              >
                Why Choose Us
              </h2>
              <div
                class="mt-2 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Unique Selling Points
              </div>
              <div class="mt-4 mb-10 max-w-3xl text-center text-xl text-gray-500 lg:mx-auto">
                What sets our SCADA/IoT system apart from traditional solutions.
              </div>

              <div class="grid grid-cols-2 gap-6 md:grid-cols-3">
                <div
                  v-for="(usp, index) in usps"
                  :key="index"
                  class="rounded-xl border border-gray-200 p-5 text-center transition-colors hover:border-emerald-500 dark:border-gray-700 dark:hover:border-emerald-500"
                >
                  <component :is="usp.icon" class="mx-auto mb-4 h-10 w-10 text-emerald-500" />
                  <h3 class="mb-2 font-semibold">{{ usp.title }}</h3>
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ usp.description }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Applications Section -->
          <section id="applications" class="bg-gray-50 py-16 dark:bg-gray-800">
            <div class="container mx-auto px-4">
              <h2
                class="text-center text-base font-semibold tracking-wide text-emerald-600 uppercase"
              >
                Applications
              </h2>
              <div
                class="mt-2 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Potential Applications
              </div>
              <div class="mt-4 mb-10 max-w-3xl text-center text-xl text-gray-500 lg:mx-auto">
                Our SCADA/IoT system is versatile and can be applied to various industries and use
                cases.
              </div>

              <div class="grid gap-6 md:grid-cols-3">
                <div
                  v-for="(app, index) in applications"
                  :key="index"
                  class="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-900"
                >
                  <div class="mb-4 flex items-center">
                    <component :is="app.icon" class="h-12 w-12 text-emerald-500" />
                    <h3 class="ml-3 text-xl font-semibold">
                      {{ app.title }}
                    </h3>
                  </div>
                  <div class="text-gray-600 dark:text-gray-300">{{ app.description }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Get Started -->
          <section class="py-12 md:py-16">
            <div class="container mx-auto px-4 md:px-6">
              <div class="mx-auto max-w-4xl space-y-4 text-center">
                <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
                <div class="text-muted-foreground md:text-xl/relaxed">
                  Interested in learning more about our SCADA/IoT system? We'd love to hear from
                  you.
                </div>
                <div
                  class="mx-auto flex max-w-sm flex-col justify-center gap-2 min-[400px]:flex-row"
                >
                  <router-link
                    :to="{ name: 'contact' }"
                    class="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-emerald-700 hover:shadow-xl focus-visible:ring-1 focus-visible:ring-emerald-700 focus-visible:outline-none"
                  >
                    Contact Us
                  </router-link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Database as DatabaseIcon,
  ChartLine as ChartLineIcon,
  Monitor as MonitorIcon,
  Layers as LayersIcon,
  AlertTriangle as AlertTriangleIcon,
  Lock as LockIcon,
  Cpu as CpuIcon,
  Zap as ZapIcon,
  Sliders as SlidersIcon,
  Server as ServerIcon,
  CheckCircle as CheckCircleIcon,
  CodeXml as CodeXmlIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  Network as NetworkIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Thermometer as ThermometerIcon,
  Wind as WindIcon,
  Activity as ActivityIcon2,
  Grid as GridIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

import { ref } from 'vue'

const slide = ref('photo-1')
const autoplay = ref(true)
// const navItems = [
//   { id: 'introduction', label: 'Introduction' },
//   { id: 'features', label: 'Features' },
//   { id: 'technology', label: 'Technology' },
//   { id: 'case-study', label: 'Case Study' },
//   { id: 'contact', label: 'Contact' }
// ]

const challenges = [
  {
    icon: DollarSignIcon,
    title: 'High Costs',
    description:
      'Expensive proprietary hardware, software licenses, and specialized engineering expertise.'
  },
  {
    icon: LockIcon,
    title: 'Inflexibility',
    description:
      'Rigid architectures that are difficult to adapt or integrate with modern IT systems.'
  },
  {
    icon: ClockIcon,
    title: 'Slow Innovation',
    description:
      'Reliance on vendor-specific updates and limited access to cutting-edge technologies.'
  },
  {
    icon: AlertTriangleIcon,
    title: 'Vendor Lock-in',
    description: 'Dependence on specific vendors for support and expansion.'
  },
  {
    icon: MonitorIcon,
    title: 'Outdated Interfaces',
    description: 'Often rely on older, non-responsive HMI technologies, limiting accessibility.'
  },
  {
    icon: CpuIcon,
    title: 'Skill Gaps',
    description: 'Require specialized engineers, making hiring and maintenance challenging.'
  }
]

// const solutionBenefits = [
//   {
//     title: 'Cost-Effective',
//     description: 'Significantly reduces hardware and engineering costs.'
//   },
//   {
//     title: 'Flexible & Scalable',
//     description: 'Easily adapts to changing requirements and scales horizontally.'
//   },
//   {
//     title: 'Open & Interoperable',
//     description: 'Uses standard protocols and open-source components.'
//   },
//   {
//     title: 'Developer-Friendly',
//     description:
//       'Employs a unified JavaScript/TypeScript stack, simplifying development and talent acquisition.'
//   },
//   {
//     title: 'Accessible',
//     description: 'Features a modern, responsive web-based HMI accessible on any device.'
//   }
// ]

const features = [
  {
    icon: DollarSignIcon,
    title: 'Significant Cost Savings',
    benefit: 'Lower total cost of ownership compared to traditional systems. Avoid vendor lock-in.',
    items: [
      'Leverages open-source software (Node.js, Vue, MongoDB, etc.)',
      'Uses cost-effective hardware (Raspberry Pi, Arduino) as software-defined PLCs',
      'Employs open protocols (Modbus RTU, REST, WebSockets)',
      'Unified JavaScript/TypeScript stack reduces engineering time'
    ]
  },
  {
    icon: ActivityIcon2,
    title: 'Real-time Monitoring & Control',
    benefit: 'Instant visibility into plant operations from anywhere.',
    items: [
      'Live dashboards displaying key parameters (temps, pressures, flows, power metrics)',
      'Remote control capabilities for valves, load banks, etc.',
      'Live IP camera feeds integrated into the HMI',
      'Responsive design works on any device'
    ]
  },
  {
    icon: DatabaseIcon,
    title: 'Advanced Data Acquisition & Logging',
    benefit: 'Capture high-fidelity data for research, analysis, and troubleshooting.',
    items: [
      'High-frequency data logging (>100 sensors, ~1-second resolution)',
      'Robust data buffering ensures no data loss even with unreliable connections',
      'Time-series database (MongoDB) optimized for sensor data',
      'Secure data storage and access control'
    ]
  },
  {
    icon: ChartLineIcon,
    title: 'Powerful Historical Data Analysis',
    benefit: 'Understand long-term trends, diagnose issues, and optimize performance.',
    items: [
      'Interactive charts capable of visualizing massive datasets (>1 billion data points)',
      'Data export (CSV, JSON) for offline analysis',
      'Historical trend reporting tools',
      'Customizable dashboards for different analysis needs'
    ]
  },
  {
    icon: MonitorIcon,
    title: 'Modern, Responsive HMI',
    benefit: 'Access system data and controls conveniently on any device.',
    items: [
      'Web-based HMI built with Vue 3/Quasar',
      'Fully responsive design works on phones, tablets, laptops, and large monitors',
      'Progressive Web App (PWA) for app-like experience on mobile',
      'Intuitive user interface with minimal training required'
    ]
  },
  {
    icon: LayersIcon,
    title: 'Modular & Scalable Architecture',
    benefit: 'Easily expand the system or adapt it for different applications.',
    items: [
      'Distributed architecture (Field, Edge, Supervisor, Presentation layers)',
      'Supports a wide range of industrial sensors and actuators',
      'Horizontally scalable backend using containerization',
      'Plug-and-play component architecture'
    ]
  }
]

const techStack = {
  hardware: [
    'Raspberry Pi (Edge PLC)',
    'Industrial RTUs',
    'Diverse Sensors (PT100, Pressure, Flow, Power, RPM, pH, etc.)',
    'Actuators (Valves, Alarms)',
    'ABB Inverters',
    'IP Cameras',
    'Network Gear (Switches, 4G Routers, USB-RS485 Converters)',
    'Mean Well Power Supplies',
    'Analysis tools (Hioki power analyzers, FLIR thermal cameras)'
  ],
  software: [
    'Backend/PLC: Node.js, FeathersJS, TypeScript',
    'Frontend (HMI): Vue 3, Quasar Framework, Highcharts, TypeScript',
    'Database: MongoDB',
    'OS (Edge): Raspberry Pi OS / Linux',
    'Process Management: PM2',
    'Web Server: Nginx'
  ],
  protocols: ['Modbus RTU (RS-485)', 'REST APIs', 'WebSockets (TCP/IP)', 'HTTP/HTTPS']
}

// const caseStudyResults = [
//   {
//     icon: TrendingUpIcon,
//     title: 'Performance Improvement',
//     description:
//       'Facilitated optimizations leading to a recorded power output increase under the same well conditions.',
//     metric: '70kW → 180kW'
//   },
//   {
//     icon: MaximizeIcon,
//     title: 'Turbine Optimization',
//     description:
//       'Turbine height adjustment guided by system data resulted in a significant power increase.',
//     metric: '250% Increase'
//   },
//   {
//     icon: DollarSignIcon,
//     title: 'Cost Reduction',
//     description:
//       'Direct factory sourcing guided by system requirements led to significant cost reductions on components.',
//     metric: 'Up to 90% Savings'
//   },
//   {
//     icon: ZapIcon,
//     title: 'Successful Testing',
//     description: 'Supported load bank tests and stable grid-tie synchronization tests.',
//     metric: '150kW Grid-Tied'
//   }
// ]

const photos = [
  {
    title: `Harnessing Earth's Heat`,
    description:
      'The SCADA/IoT monitored Total Flow power generation unit operating on-site in Yilan, Taiwan.'
  },
  {
    title: 'Real-Time Control Hub',
    description:
      'Main control panel with Remote Terminal Units (RTUs) displaying live data from ~70 sensors to optimize geothermal power generation.'
  },
  {
    title: 'Hands-On Innovation',
    description:
      'System Architect Han Lin finishes building the SCADA/IoT control panel, leveraging cost-effective hardware and open-source technology to revolutionize geothermal monitoring.'
  },
  {
    title: 'Instrumentation & Control Points',
    description:
      'The turbine-generator assembly fitted with pressure/temperature transmitters feeding data to the SCADA system.'
  },
  {
    title: 'Heart of the Generator',
    description:
      'A close-up view of the cavitation nozzle and impact turbine module, the core component converting fluid energy into mechanical power, monitored and optimized by our SCADA/IoT system.'
  },
  {
    title: 'Geothermal Power in Action',
    description:
      'Witness the dynamic steam release from the cavitation nozzle, optimized by our SCADA/IoT system for enhanced energy output.'
  },
  {
    title: 'Thermal Signatures Unlocked',
    description:
      'Captured FLIR thermal image reveals dynamic temperature variations of the nozzle output.'
  },
  {
    title: 'Geothermal Fluid Processing',
    description:
      'Field equipment managing the two-phase geothermal fluid before energy extraction monitored by the SCADA/IoT system'
  },
  {
    title: 'Digital Twin Concept',
    description: `Conceptual visualization of the early stage plant, illustrating the key components and energy flow within the SCADA-monitored geothermal system.`
  }
]

const usps = [
  {
    icon: DollarSignIcon,
    title: 'Cost Reduction',
    description:
      'Significantly lower hardware, software, and engineering costs vs. traditional SCADA/DCS.'
  },
  {
    icon: CodeIcon,
    title: 'Modern Technology',
    description:
      'Built with current web and IoT technologies (Node.js, Vue PWA, WebSockets, MongoDB).'
  },
  {
    icon: SlidersIcon,
    title: 'Unmatched Flexibility',
    description: 'Open architecture, standard protocols, easily customizable and scalable.'
  },
  {
    icon: ServerIcon,
    title: 'Developer-Friendly',
    description:
      'Unified JavaScript/TypeScript stack simplifies development, integration, and hiring.'
  },
  {
    icon: CheckCircleIcon,
    title: 'Proven in Field',
    description: 'Successfully deployed and validated in a real-world geothermal research project.'
  },
  {
    icon: MonitorIcon,
    title: 'Cross-Platform',
    description: 'Monitor and control from any device (phone, tablet, desktop).'
  }
]

const applications = [
  {
    icon: ThermometerIcon,
    title: 'Geothermal Power',
    description:
      'Pilot, research, and commercial geothermal power plants requiring advanced monitoring and control.'
  },
  {
    icon: WindIcon,
    title: 'Renewable Energy',
    description:
      'Monitoring systems for solar, wind, and other renewable energy sources with similar requirements.'
  },
  {
    icon: SettingsIcon,
    title: 'Industrial Process',
    description:
      'Manufacturing and industrial process monitoring and control applications seeking modern solutions.'
  },
  {
    icon: SearchIcon,
    title: 'Research Institutions',
    description:
      'Universities and research facilities needing high-frequency data acquisition and analysis capabilities for experiments.'
  },
  {
    icon: GridIcon,
    title: 'Distributed Assets',
    description:
      'Organizations with geographically distributed assets requiring centralized monitoring and management.'
  },
  {
    icon: ActivityIcon2,
    title: 'Legacy Modernization',
    description:
      'Organizations seeking to modernize legacy SCADA/DCS systems cost-effectively with open technologies.'
  }
]
</script>

<style>
html {
  scroll-behavior: smooth;
}

.about {
  font-size: 16px;
  font-family: 'Geist', 'monospace', 'title', 'Inter', sans-serif;
}
</style>
