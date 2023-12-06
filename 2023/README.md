Run with `deno run --allow-read 1a.ts`

Times:
```bash
TIMEFMT="%*Es wall; %*Us userspace"; for file in `ls *{a,b}.ts | sort -g`; do echo -n "deno $file: "; time deno run --allow-read $file > /dev/null ; done

deno 1a.ts: 0.039s wall; 0.024s userspace
deno 1b.ts: 0.038s wall; 0.029s userspace
deno 2a.ts: 0.037s wall; 0.025s userspace
deno 2b.ts: 0.028s wall; 0.015s userspace
deno 3a.ts: 0.027s wall; 0.016s userspace
deno 3b.ts: 0.026s wall; 0.016s userspace
deno 4a.ts: 0.028s wall; 0.016s userspace
deno 4b.ts: 0.028s wall; 0.016s userspace
deno 5a.ts: 0.024s wall; 0.014s userspace
deno 5b.ts: 0.037s wall; 0.029s userspace
deno 6a.ts: 0.027s wall; 0.013s userspace
deno 6b.ts: 0.023s wall; 0.013s userspace
```