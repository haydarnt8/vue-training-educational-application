<script lang="ts" setup></script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>
            <span class="headline">404 Not Found</span>
          </v-card-title>
          <v-card-text>
            <p>Sorry, the page you are looking for could not be found.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="$router.push({ name: 'home' })">Go Home</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
