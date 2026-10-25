/**
 * hash_table.c - Hash Table Implementation using Horner's Polynomial Rolling Hash
 * and Separate Chaining for Collision Resolution.
 */

#include "hash_table.h"
#include <ctype.h>

void ht_init(HashTable* ht) {
    if (!ht) return;
    for (int i = 0; i < HASH_TABLE_CAPACITY; i++) {
        ht->buckets[i] = NULL;
    }
    ht->size = 0;
    ht->collisionCount = 0;
}

/**
 * Polynomial rolling hash function:
 * h(s) = (sum(s[i] * 31^(n - 1 - i))) mod capacity
 */
unsigned int ht_hash(const char* key) {
    unsigned long hash = 0;
    const unsigned int prime = 31;
    for (int i = 0; key[i] != '\0'; i++) {
        char c = (char)tolower(key[i]);
        hash = (hash * prime + (unsigned char)c) % HASH_TABLE_CAPACITY;
    }
    return (unsigned int)hash;
}

void ht_insert(HashTable* ht, const char* key, int vertexIndex) {
    if (!ht || !key) return;
    unsigned int index = ht_hash(key);
    
    // Check if key already exists to update index
    HashEntry* curr = ht->buckets[index];
    while (curr != NULL) {
        if (strcasecmp(curr->key, key) == 0) {
            curr->vertexIndex = vertexIndex;
            return;
        }
        curr = curr->next;
    }

    // Collision detected if bucket already occupied
    if (ht->buckets[index] != NULL) {
        ht->collisionCount++;
    }

    // Allocate new hash entry node and push to front of chain
    HashEntry* newEntry = (HashEntry*)malloc(sizeof(HashEntry));
    if (!newEntry) return;

    strncpy(newEntry->key, key, MAX_ID_LEN - 1);
    newEntry->key[MAX_ID_LEN - 1] = '\0';
    newEntry->vertexIndex = vertexIndex;
    newEntry->next = ht->buckets[index];
    ht->buckets[index] = newEntry;

    ht->size++;
}

int ht_search(const HashTable* ht, const char* key) {
    if (!ht || !key) return -1;
    unsigned int index = ht_hash(key);
    HashEntry* curr = ht->buckets[index];
    
    while (curr != NULL) {
        if (strcasecmp(curr->key, key) == 0) {
            return curr->vertexIndex;
        }
        curr = curr->next;
    }
    return -1; // Not found
}

void ht_print_diagnostics(const HashTable* ht, const Graph* graph) {
    printf("\n=== HASH TABLE BUCKET DIAGNOSTICS (Separate Chaining) ===\n");
    printf("Capacity: %d buckets | Size: %d entries | Collisions: %d | Load Factor: %.2f\n",
           HASH_TABLE_CAPACITY, ht->size, ht->collisionCount,
           (float)ht->size / HASH_TABLE_CAPACITY);
    printf("---------------------------------------------------------\n");

    for (int i = 0; i < HASH_TABLE_CAPACITY; i++) {
        printf("Bucket [%02d]: ", i);
        HashEntry* curr = ht->buckets[i];
        if (!curr) {
            printf("(empty)\n");
        } else {
            while (curr != NULL) {
                const char* bName = (graph && curr->vertexIndex >= 0 && curr->vertexIndex < graph->vertexCount)
                                    ? graph->vertices[curr->vertexIndex].name : "Unknown";
                printf("['%s' -> %s] -> ", curr->key, bName);
                curr = curr->next;
            }
            printf("NULL\n");
        }
    }
    printf("=========================================================\n\n");
}

void ht_free(HashTable* ht) {
    if (!ht) return;
    for (int i = 0; i < HASH_TABLE_CAPACITY; i++) {
        HashEntry* curr = ht->buckets[i];
        while (curr != NULL) {
            HashEntry* next = curr->next;
            free(curr);
            curr = next;
        }
        ht->buckets[i] = NULL;
    }
    ht->size = 0;
    ht->collisionCount = 0;
}
