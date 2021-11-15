<template>
  <div class='q-pa-md'>
    <div class='row justify-end q-mb-md'>
      <q-select
        class='col-3'
        v-model='selectedSort'
        emit-value
        :options='sortOptions'
        label='Filter By'
        clearable
        option-label="label"
        option-value="value"
        map-options
      />
    </div>

    <transition-group name='book-list'>
      <q-card v-for='book in sortedBooks' bordered :key='book.id' class='book'>
        <q-card-section class='row justify-between'>
          <div class='text-h6 col-xs-12 col-sm-6'>{{ book.title }}</div>
          <div class='text-subtitle2 col-xs-12 col-sm-6 date'>{{ getDate(book.publishDate) }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          {{ book.description }}
        </q-card-section>
      </q-card>
    </transition-group>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { BookService } from 'src/services/book.service';
import { Book } from 'src/interfaces/Book';

import { date } from 'quasar';

export default defineComponent({
  name: 'Books',
  data() {
    return {
      books: [] as Book[],
      selectedSort: null,
      sortOptions: [{ label: 'Title', value: 'title' }, { label: 'Publish Date', value: 'publishDate' }]
    };
  },
  computed: {
    sortedBooks(): Book[] {
      if (!this.selectedSort) {
        return this.books;
      }

      return [...this.books].sort((a: Book, b: Book) => {
        // @ts-ignore
        return a[this.selectedSort].localeCompare(b[this.selectedSort], undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
    }
  },
  methods: {
    getDate(publishDate: Date) {
      return date.formatDate(publishDate, 'YYYY-MM-DD HH:mm:ss');
    },
    getBooks() {
      BookService.getBooks().then(response => {
        this.books = response;
      }).catch(err => {
        console.log(err);
      });
    }
  },
  created() {
    this.getBooks();
  }
});
</script>

<style scoped>
.book {
  margin-bottom: 10px;
}

.book-list-item {
  display: inline-block;
  margin-right: 10px;
}

.book-list-enter-active,
.book-list-leave-active {
  transition: all 0.4s ease;
}

.book-list-enter-from,
.book-list-leave-to {
  opacity: 0;
  transform: translateX(130px);
}

.book-list-move {
  transition: transform 0.4s ease;
}

@media screen and (min-width: 599px) {
  .date {
    text-align: end;
  }
}
</style>
