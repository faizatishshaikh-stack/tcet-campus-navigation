/**
 * hash_table.h - Hash Table with Separate Chaining for Campus Location Lookup
 */

#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include "dsa_types.h"

void ht_init(HashTable* ht);
unsigned int ht_hash(const char* key);
void ht_insert(HashTable* ht, const char* key, int vertexIndex);
int ht_search(const HashTable* ht, const char* key);
void ht_print_diagnostics(const HashTable* ht, const Graph* graph);
void ht_free(HashTable* ht);

#endif /* HASH_TABLE_H */
