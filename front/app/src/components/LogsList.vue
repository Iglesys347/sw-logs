<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          <div v-if="appName != null">
            {{ appName }}
          </div>
          <div v-else>All logs</div>
        </h1>
      </v-col>
      <v-col md="3">
        <v-select
          label="Filter by level"
          :items="levels"
          v-model="filterLevel"
          density="compact"
          variant="solo"
          clearable
          @update:model-value="clearFilter()"
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field
          label="Filter by content"
          v-model="filterContent"
          density="compact"
          variant="solo"
          append-inner-icon="mdi-magnify"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>

  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">Timestamp</th>
        <th class="text-left" v-if="appName == null">Application</th>
        <th class="text-left">Level</th>
        <th class="text-left">Message</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in filteredData"
        :key="item"
        :class="`bg-${levelToColor[item.message.levelname]}`"
      >
        <td>{{ timestampToDate(item.message.created) }}</td>
        <td v-if="appName == null">{{ item.name }}</td>
        <td>{{ item.message.levelname }}</td>
        <td>{{ item.message.msg }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { useStore } from "../stores/data";

export default {
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  data: () => ({
    maxSize: 100,
    levelToColor: {
      INFO: "green", //"green-lighten-3",
      ERROR: "red", //"red-lighten-3",
      WARNING: "orange", //"orange-lighten-3",
      DEBUG: "blue", //"blue-lighten-3",
    },
    levels: ["DEBUG", "INFO", "WARNING", "ERROR"],
    filterLevel: null,
    filterContent: null,
  }),
  props: {
    appName: String,
  },
  computed: {
    data() {
      if (this.appName != null) {
        return this.store.data
          .filter((elt) => elt.name == this.appName)
          .map((elt) => {
            return {
              name: elt.name,
              message: elt.messages[0].message,
            };
          });
      }
      return this.store.data.map((elt) => {
        return {
          name: elt.name,
          message: elt.messages[0].message,
        };
      });
    },
    filteredData() {
      let filtered = this.data;
      if (this.filterLevel != null) {
        filtered = filtered.filter(
          (log) => log.message.levelname == this.filterLevel
        );
      }
      if (this.filterContent != null) {
        filtered = filtered.filter((log) =>
          log.message.msg
            .toLowerCase()
            .includes(this.filterContent.toLowerCase())
        );
      }
      return filtered;
    },
  },
  methods: {
    timestampToDate(timestamp) {
      var dateFormat = new Date(parseFloat(timestamp * 1000));
      return dateFormat.toLocaleString();
    },
    clearFilter() {
      this.filterContent = null;
    },
  },
};
</script>
