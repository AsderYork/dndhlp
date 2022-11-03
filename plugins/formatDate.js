import Vue from "vue";

Vue.filter("formatDateShort", (dateStr) =>
  Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
);

Vue.filter("formatDateFull", (dateStr) => {

    var options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false
    };

    return Intl.DateTimeFormat("us-EN", options).format(new Date(dateStr))
  }
);
