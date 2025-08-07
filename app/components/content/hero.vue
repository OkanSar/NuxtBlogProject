<template>
  <section class="p-6 rounded mb-6">
    <h2 class="text-2xl font-bold mb-2">
      <slot />
    </h2>
    <p class="text-gray-600">
      <slot name="description" />
    </p>
  </section>
</template>
