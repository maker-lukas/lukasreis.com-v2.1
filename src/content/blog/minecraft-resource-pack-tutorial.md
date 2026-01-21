---
title: "minecraft enchanted textures"
description: "minecraft resource pack"
date: 2026-01-22
tags: ["tutorial"]
---

This is what you'll get after this tutorial


## Before You Start

- **Resources**
    - My Resource Pack <a href="https://github.com/maker-lukas/B.E.T.T" class="link">github.com/maker-lukas/B.E.T.T</a>
    - <a href="https://minecraft.wiki/w/Tutorial:Creating_a_resource_pack" class="link">minecraft.wiki/Tutorial:Creating_a_resource_pack</a>
- **What you'll Need**
    - Text Editor (VS Code, NotePad++, etc)
    - Minecraft version **1.21.5+** (older versions do not support data driven item models)
    - Basic understanding of json

---
## Getting Started

Below is the folder structure used in this tutorial.\
It is already organized so you can add more enchantments later.

```
project_root/
├── pack.mcmeta
├── pack.png
│
└── assets/
    └── minecraft/
        ├── models/
        │   └── item/
        │       └── sword/
        │           └── diamond/
        │               └── fire_aspect.json
        │
        ├── textures/
        │   └── item/
        │       └── sword/
        │           ├── diamond/
        │           │   └── diamond_sword.png
        │           │
        │           └── shared/
        │               ├── fire_aspect.png
        │               └── fire_aspect.png.mcmeta
        │
        └── items/
            └── diamond_sword.json
```
---

## pack.mcmeta

Create <span class="codelet">`pack.mcmeta`</span> at the root of your project.
Because this tutorial uses **data-driven item models**, the resource
pack must target **Minecraft 1.21.5 or newer**.

The <span class="codelet">`min_format`</span> value of <span class="codelet">`55`</span> corresponds to Minecraft **1.21.5**,
which is when this feature was introduced.

``` json
{
  "pack": {
    "description": "your pack description",
    "min_format": 55
  }
}
```

---

## pack.png

<span class="codelet">`pack.png`</span> can be any square PNG image.\
This is just the icon shown in the resource pack menu.

---

## Enchantment Texture

Next, add the texture that represents the enchantment effect.

In this example, the Fire Aspect texture is animated, so it uses a sprite sheet.

You can download my sprite sheet here:
<a href="../../../public/images/fire_aspect.png" download class="link">fire_aspect.png</a>


Place the file here:

```
assets/minecraft/textures/item/sword/shared/
```

### Animated Texture

If your texture is animated, create a file with the same name +
<span class="codelet">`.mcmeta`</span>:

```
fire_aspect.png.mcmeta
```

``` json
{
  "animation": {
    "frametime": 2
  }
}
```

Minecraft runs at **20 ticks per second**, so: 
- <span class="codelet">`frametime: 20`</span> = 1
second
- <span class="codelet">`frametime: 0.1`</span> = 0.1 seconds per frame

---

## Item Model (Enchantment Overlay)

Now we create the model that combines the base sword with the enchantment texture

Create this file:

```
assets/minecraft/models/item/sword/diamond/fire_aspect.json
```

This model uses the default handheld sword model and renders two texture layers

- <span class="codelet">`layer0`</span> renders first
- <span class="codelet">`layer1`</span> renders on top of 0

In my texture i want the Fire Aspect under the sword texture but if you have custom texture the layer order might be diffrent

``` json
{
  "parent": "minecraft:item/handheld",
  "textures": {
    "layer0": "minecraft:item/sword/shared/fire_aspect",
    "layer1": "minecraft:item/sword/diamond/diamond_sword"
  }
}
```
> Note: Texture paths never include .png

---

## Enchantment Detection

This part tels Minecraft when to switch models based on enchantments

Create this file:

```
assets/minecraft/items/diamond_sword.json
```

<span class="warning">WARNING</span>
JSON does not support comments. The comments below are for explanation only and must be removed in the final file.

```jsonc
{
    "model": {
        // Composite type allows combining multiple models
        "type": "minecraft:composite", 
        "models": [
            // Base model: render the default diamond sword
            {
                "type": "minecraft:model",
                "model": "minecraft:item/diamond_sword"
            },

            // Conditional model: check if item has Fire Aspect enchantment
            {
                "type": "minecraft:condition",
                "property": "minecraft:component",
                "predicate": "minecraft:enchantments",
                // Define which enchantment to look for
                "value": [
                    {
                        "enchantments": "minecraft:fire_aspect",
                        "levels": {"min": 1}
                    }
                ],
                // If enchantment is present: render the fire aspect overlay model
                "on_true": {"type": "minecraft:model", "model": "minecraft:item/sword/diamond/fire_aspect"},
                "on_false": {"type": "minecraft:empty"}
            }

        ]
    }
}
```

---

## Adding More Enchantments

To add additional enchantments:

1. Copy the entire <span class="codelet">`minecraft:condition`</span> block including the brackets
2. Paste it directly after the previous one
3. Change:
    - Enchantment ID
    - Model path

---

## Packaging

Zip the following files:

```
assets/
pack.mcmeta
pack.png
```

You can rename the <span class="codelet">`.zip`</span> file however you want

---

## Testing In Game

1. Launch Minecraft
2. Go to **Options → Resource Packs**
3. Click **Open Pack Folder**
4. Drag your <span class="codelet">`.zip`</span> file into the folder
5. Enable the pack
6. Enter a world and enchant a diamond sword with Fire Aspect

If everything is correct, the texture should change.

---

## Troubleshooting

- Press <span class="codelet">F3 + T</span> to reload resource packs
- Check file paths and enchantment IDs

---