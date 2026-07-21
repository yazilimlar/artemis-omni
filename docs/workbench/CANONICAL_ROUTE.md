# ARTEMIS Geometric Workbench canonical route

The public product route is `/workbench`.

The canonical application route is `/workbench/app`.

The latest implementation is exposed internally through `/workbench/runtime/latest` and currently resolves to the static Workbench implementation retained under the historical `public/labs/geometric-workbench/v5-8/` directory.

Direct requests to the historical `/labs/geometric-workbench/v5-8` and `/labs/geometric-workbench/v5-8/index.html` URLs redirect to `/workbench/app`.

The application shell defaults to **v6.0.0-alpha — Latest** and provides an explicit **v5.9 — Superseded** option backed by the pinned pre-v6 commit `3fbc18a0caa627589a6b9b314d14f9aefc67522a`.

The historical physical directory name is an implementation detail and must not be used as the public product version.
