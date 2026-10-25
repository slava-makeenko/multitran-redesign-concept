import { SEARCH_INDEX } from '@/lib/entries';

import { SearchBox } from './SearchBox';

type Props = Omit<Parameters<typeof SearchBox>[0], 'index'>;

// Серверная обёртка: подставляет индекс поиска, собранный при сборке.
// Статьи остаются на сервере, в браузер уходит только компактный индекс.
export function Search(props: Props) {
  return <SearchBox {...props} index={SEARCH_INDEX} />;
}
