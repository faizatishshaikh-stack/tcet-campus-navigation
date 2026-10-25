@echo off
echo ==============================================================
echo  Compiling Apex Campus Navigation C DSA Engine
echo ==============================================================

where gcc >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [FOUND] GCC compiler detected. Compiling with MinGW/GCC...
    gcc -O2 -Wall -o campus_cli.exe cli_runner.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Built campus_cli.exe successfully!
    ) else (
        echo [ERROR] Failed to compile campus_cli.exe
    )

    gcc -O2 -Wall -o campus_server.exe server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c -lws2_32
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Built campus_server.exe successfully!
    ) else (
        echo [ERROR] Failed to compile campus_server.exe
    )
    goto finish
)

where cl >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [FOUND] Microsoft Visual C++ (MSVC) detected. Compiling with cl...
    cl /O2 /W3 cli_runner.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c /Fe:campus_cli.exe
    cl /O2 /W3 server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c ws2_32.lib /Fe:campus_server.exe
    goto finish
)

echo [NOTICE] Neither 'gcc' nor 'cl' was found on your Windows PATH.
echo To compile the C backend:
echo 1. Install MinGW-w64 or Visual Studio Community (C++ workload).
echo 2. Add gcc or cl to your system PATH.
echo 3. Run: gcc -O2 -o campus_server.exe server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c -lws2_32
echo.
echo NOTE: The React frontend has a pure, mirrored JavaScript DSA engine running 
echo automatically in the browser with full fidelity, so C compilation is completely optional!

:finish
echo Done.
