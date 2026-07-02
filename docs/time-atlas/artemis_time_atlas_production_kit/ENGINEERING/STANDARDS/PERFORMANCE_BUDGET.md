# Performance Budget

## Target Devices

- iPhone SE class screen size
- mid-tier Android
- mobile Safari
- mobile Chrome

## Targets

- Minimum frame rate: 30 FPS
- Initial route load: as light as possible
- Draw calls: < 300 target
- Visible triangles: < 150,000
- No heavy post-processing in the first implementation
- No physics
- No real-time global illumination

## Required Techniques

- InstancedMesh for trees, houses, farm markers, small props
- Merged static geometry where safe
- Lazy-load the 3D route
- Dispose geometries/textures on unmount where applicable
- Compress textures before public release
- Keep shadows limited to one primary directional light

## Red Flags

- OrbitControls exposed in production
- Unbounded camera movement
- multiple large GLB files loading at startup
- uncompressed 4K textures
- many unique tree meshes
- post-processing stack added before FPS validation
