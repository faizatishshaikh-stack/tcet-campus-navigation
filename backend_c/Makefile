CC = gcc
CFLAGS = -Wall -Wextra -O2 -std=c99
LDFLAGS = 

# Detect Windows for Winsock
ifeq ($(OS),Windows_NT)
    LDFLAGS += -lws2_32
    BIN_EXT = .exe
else
    BIN_EXT =
endif

COMMON_SRC = graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c
COMMON_OBJ = $(COMMON_SRC:.c=.o)

all: campus_cli$(BIN_EXT) campus_server$(BIN_EXT)

campus_cli$(BIN_EXT): cli_runner.o $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

campus_server$(BIN_EXT): server.o $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.o campus_cli$(BIN_EXT) campus_server$(BIN_EXT)

.PHONY: all clean
