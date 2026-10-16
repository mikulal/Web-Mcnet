import bpy, math, sys, os
from mathutils import Vector

OUT = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "/tmp/duct.png"
THEME = sys.argv[sys.argv.index("--") + 2] if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 2 else "light"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

if THEME == "dark":
    PAPER, INK, FILL, FILL_DARK, ACCENT = (0.035, 0.05, 0.07), (0.78, 0.82, 0.86), (0.055, 0.075, 0.10), (0.02, 0.03, 0.045), (0.30, 0.75, 0.55)
else:
    PAPER, INK, FILL, FILL_DARK, ACCENT = (0.93, 0.91, 0.87), (0.06, 0.07, 0.09), (0.97, 0.955, 0.93), (0.62, 0.60, 0.57), (0.02, 0.32, 0.75)


def mat_flat(name, light, dark):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.35
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = (*light, 1)
    mix.inputs[7].default_value = (*dark, 1)
    nt.links.new(lw.outputs["Facing"], mix.inputs[0])
    nt.links.new(mix.outputs[2], em.inputs["Color"])
    nt.links.new(em.outputs[0], out.inputs[0])
    return m


def lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


M_DUCT = mat_flat("duct", FILL, lerp(FILL, FILL_DARK, 0.55))
M_MICRO = mat_flat("micro", FILL, lerp(FILL, FILL_DARK, 0.35))
M_CABLE = mat_flat("cable", lerp(FILL, FILL_DARK, 0.25), lerp(FILL, FILL_DARK, 0.6))
M_FIBER = mat_flat("fiber", FILL, lerp(FILL, FILL_DARK, 0.4))
M_ACCENT = mat_flat("accent", ACCENT, ACCENT)


def tube(name, r_out, r_in, y0, y1, x=0.0, z=0.0, mat=None, seg=96):
    L = y1 - y0
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r_out, depth=L, location=(x, (y0 + y1) / 2, z), rotation=(math.pi / 2, 0, 0))
    o = bpy.context.object
    o.name = name
    if r_in:
        bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r_in, depth=L + 0.2, location=(x, (y0 + y1) / 2, z), rotation=(math.pi / 2, 0, 0))
        cut = bpy.context.object
        mod = o.modifiers.new("cut", "BOOLEAN")
        mod.operation = "DIFFERENCE"
        mod.object = cut
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier="cut")
        bpy.data.objects.remove(cut, do_unlink=True)
    if mat:
        o.data.materials.append(mat)
    return o


def fiber_curve(name, pts, r, mat):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = r
    cu.bevel_resolution = 4
    cu.resolution_u = 24
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    cu.use_fill_caps = True
    o = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(o)
    o.data.materials.append(mat)
    return o


# HDPE chránička 40 mm (scale: 1 unit = 1 cm)
tube("chranicka", 2.0, 1.72, -14.0, 0.0, mat=M_DUCT)

# 7 mikrotrubiček 10/8 v šestiúhelníku
ring = 1.1
r_out, r_in = 0.53, 0.40
positions = [(0.0, 0.0)] + [(ring * math.cos(math.radians(a)), ring * math.sin(math.radians(a))) for a in range(90, 450, 60)]
stick = [3.2, 1.4, 2.2, 0.9, 1.8, 1.2, 2.6]
for i, ((x, z), s) in enumerate(zip(positions, stick)):
    tube(f"mikro_{i}", r_out, r_in, -14.0, s, x=x, z=z, mat=M_MICRO, seg=64)

# zafouknutý kabel ve střední mikrotrubičce
cx, cz = positions[0]
tube("kabel", 0.30, None, -14.0, 5.6, x=cx, z=cz, mat=M_CABLE, seg=48)

# odhalená vlákna rozvětvená z konce kabelu
n = 12
for k in range(n):
    a = 2 * math.pi * k / n
    start = Vector((cx + 0.14 * math.cos(a), 5.55, cz + 0.14 * math.sin(a)))
    spread = 0.9 + 0.35 * ((k * 7) % 5) / 4
    mid = Vector((cx + spread * 0.55 * math.cos(a), 7.0 + 0.3 * (k % 3), cz + spread * 0.55 * math.sin(a)))
    end = Vector((cx + spread * math.cos(a + 0.25), 8.6 + 0.6 * ((k * 5) % 4) / 3, cz + spread * math.sin(a + 0.25)))
    fiber_curve(f"vlakno_{k}", [start, mid, end], 0.045 if k == 3 else 0.028, M_ACCENT if k == 3 else M_FIBER)

# světlo – svítící vlákno vystupuje dál
for o in scene.objects:
    if o.type == "MESH":
        for p in o.data.polygons:
            p.use_smooth = True

# kamera – axonometrie
cam_data = bpy.data.cameras.new("cam")
cam_data.type = "ORTHO"
cam_data.ortho_scale = 15.5
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
target = Vector((0.4, 1.2, 0.0))
direction = Vector((1.0, 1.15, 0.72)).normalized()
cam.location = target + direction * 40
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

# svět + render
world = bpy.data.worlds.new("w")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (*PAPER, 1)
bg.inputs[1].default_value = 1.0

scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 64
scene.cycles.use_denoising = False
scene.view_settings.view_transform = "Standard"
scene.render.resolution_x = 2400
scene.render.resolution_y = 1500
scene.render.film_transparent = False
scene.render.filepath = OUT
scene.render.image_settings.file_format = "PNG"

# Freestyle – čárová kresba
scene.render.use_freestyle = True
scene.render.line_thickness_mode = "ABSOLUTE"
scene.render.line_thickness = 2.2
vl = scene.view_layers[0]
vl.use_freestyle = True
fs = vl.freestyle_settings
fs.crease_angle = math.radians(140)
ls = fs.linesets[0] if fs.linesets else fs.linesets.new("lines")
ls.select_by_visibility = True
ls.visibility = "VISIBLE"
ls.select_by_edge_types = True
ls.select_silhouette = True
ls.select_border = True
ls.select_crease = True
if ls.linestyle is None:
    ls.linestyle = bpy.data.linestyles.new("ink")
ls.linestyle.color = INK
ls.linestyle.thickness = 2.2

bpy.ops.render.render(write_still=True)
print("saved", OUT)
