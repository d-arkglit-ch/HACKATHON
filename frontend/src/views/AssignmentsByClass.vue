<script>
  import Navbar from '@/components/Navbar.vue';
  import Assignment from '@/components/StudentAssignments.vue';
  
  export default {
    components: {
      Navbar,
      Assignment
    }
  };
</script>
  
<template>
    <Navbar />
    <Assignment />
  </template>