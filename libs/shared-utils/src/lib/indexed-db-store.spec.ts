import 'fake-indexeddb/auto';
import { createIndexedDbStore } from './indexed-db-store';

interface TestRecord {
  id: string;
  value: string;
}

describe('createIndexedDbStore', () => {
  it('round-trips a put()/get()', async () => {
    const store = createIndexedDbStore<TestRecord>({
      dbName: 'test-db-round-trip',
      storeName: 'records',
      keyPath: 'id',
    });

    await store.put({ id: 'a', value: 'hello' });
    const result = await store.get('a');

    expect(result).toEqual({ id: 'a', value: 'hello' });
  });

  it('getAll() returns every stored record', async () => {
    const store = createIndexedDbStore<TestRecord>({
      dbName: 'test-db-get-all',
      storeName: 'records',
      keyPath: 'id',
    });

    await store.put({ id: 'a', value: 'one' });
    await store.put({ id: 'b', value: 'two' });

    const all = await store.getAll();
    expect(all).toHaveLength(2);
    expect(all.map((r) => r.id).sort()).toEqual(['a', 'b']);
  });

  it('delete() removes a record', async () => {
    const store = createIndexedDbStore<TestRecord>({
      dbName: 'test-db-delete',
      storeName: 'records',
      keyPath: 'id',
    });

    await store.put({ id: 'a', value: 'hello' });
    await store.delete('a');

    expect(await store.get('a')).toBeUndefined();
  });

  it('persists across separate createIndexedDbStore() calls against the same db/store', async () => {
    const options = { dbName: 'test-db-persistence', storeName: 'records', keyPath: 'id' };

    const firstStore = createIndexedDbStore<TestRecord>(options);
    await firstStore.put({ id: 'a', value: 'persisted' });

    const secondStore = createIndexedDbStore<TestRecord>(options);
    const result = await secondStore.get('a');

    expect(result).toEqual({ id: 'a', value: 'persisted' });
  });
});
