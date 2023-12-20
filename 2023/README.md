Run with `deno run --allow-read 1a.ts`

Times:
```bash
TIMEFMT="%*Es wall; %*Us userspace"; for file in `ls *{a,b}*.ts | sort -g`; do echo -n "deno $file: "; time deno run --allow-read $file > /dev/null ; done

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
deno 7a.ts: 0.053s wall; 0.046s userspace
deno 7b.ts: 0.064s wall; 0.060s userspace
deno 8a.ts: 0.029s wall; 0.019s userspace
deno 8b.ts: 0.032s wall; 0.022s userspace
deno 9a.ts: 0.028s wall; 0.019s userspace
deno 9b.ts: 0.025s wall; 0.018s userspace
deno 10a.ts: 0.031s wall; 0.023s userspace
deno 10b.ts: 0.044s wall; 0.053s userspace
deno 11a.ts: 0.314s wall; 0.299s userspace
deno 11b.ts: 0.327s wall; 0.311s userspace
deno 12a.ts: 0.030s wall; 0.019s userspace
deno 12b.ts: 0.126s wall; 0.114s userspace
deno 13a.ts: 0.033s wall; 0.019s userspace
deno 13b.ts: 0.035s wall; 0.024s userspace
deno 14a.ts: 0.029s wall; 0.016s userspace
deno 14b.ts: 0.240s wall; 0.248s userspace
deno 15a.ts: 0.023s wall; 0.016s userspace
deno 15b.ts: 0.026s wall; 0.018s userspace
deno 15b2.ts: 0.029s wall; 0.024s userspace
deno 16a.ts: 0.040s wall; 0.049s userspace
deno 16b.ts: 1.711s wall; 1.861s userspace
deno 16b-multithread.ts: 0.572s wall; 3.996s userspace
deno 17a.ts: 0.645s wall; 0.655s userspace
deno 17b.ts: 3.926s wall; 3.967s userspace
deno 18a.ts: 0.097s wall; 0.110s userspace
deno 18b.ts: 0.024s wall; 0.014s userspace
deno 19a.ts: 0.029s wall; 0.020s userspace
deno 19b.ts: 0.114s wall; 0.107s userspace
deno 20a.ts: 0.033s wall; 0.031s userspace
deno 20b.ts: 0.051s wall; 0.047s userspace
```