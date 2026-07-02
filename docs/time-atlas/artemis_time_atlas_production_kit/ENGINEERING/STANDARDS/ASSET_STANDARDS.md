# Asset Standards

## V1 Asset Strategy

Use procedural placeholders first. Replace only the most visible objects with GLB assets later.

## Priority Assets

1. Terrain base
2. Citadel wall kit
3. Temple
4. House cluster kit
5. Ships
6. Trees
7. Farm patches
8. UI icons

## GLB Guidelines

- Use `.glb`
- Keep individual hero assets small
- Use baked ambient occlusion when possible
- Use texture atlases
- Prefer low draw-call modular kits over many unique meshes

## Geometry Targets

- First build target: under 100,000 visible triangles
- Stretch target: under 150,000 visible triangles after polish
- Draw calls: under 300 after optimization

## Naming

```txt
troy_wall_segment_v001.glb
troy_temple_athena_placeholder_v001.glb
troy_house_cluster_a_v001.glb
troy_ship_merchant_a_v001.glb
troy_olive_tree_a_lod0_v001.glb
```

## License Tracking

Every asset must record:
- author
- source
- license
- version
- modification notes
