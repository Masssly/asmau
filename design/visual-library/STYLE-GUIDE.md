# Asmau Visual Style Guide

## 1. North star

**Rooted in Faith. Inspired by Africa. Designed for Every Child.**

Asmau's worlds should be playful and inviting without feeling disposable or culturally generic. Aim for stylised realism: believable materials, readable silhouettes, expressive faces, soft cinematic lighting and slightly simplified forms.

The visual language should work for children roughly 3–9 years old. Avoid making everything look like a preschool cartoon; older children should still find the worlds rich and rewarding.

## 2. Cultural foundation

Primary reference family:
- Hausa and Fulani communities of the central and western Sahel.
- Historical Hausa city-states and the Sokoto Caliphate, with care around period and regional differences.
- West African Muslim scholarship, manuscript culture, trade, family life, crafts and architecture.

This is a reference foundation, not a single uniform costume or a claim that all West African Muslims share one culture. Other Asmau games may draw on other African Muslim cultures, each researched and represented distinctly.

### Cultural research rules
- Distinguish Hausa, Fulani and other neighbouring cultural traditions instead of treating them as interchangeable.
- Distinguish historical periods. A Sokoto-era babban riga is not automatically appropriate for an ancient setting.
- Research garments, headwear, architecture, tools and domestic objects separately.
- Prefer references from museums, historical collections, local scholars, artisans and community members.
- Avoid fantasy mash-ups that combine unrelated regions simply because they look “African”.
- Do not use sacred text or religious symbols as arbitrary decoration.

## 3. Character principles

All human characters in the initial Asmau visual universe are Black African, with a broad and natural range of skin tones, facial features, ages, builds and hairstyles.

Character design should:
- Be dignified, warm and expressive.
- Avoid caricature, exaggerated ethnic features and comic primitivism.
- Include children, elders, families, scholars, traders, craftspeople, farmers, travellers and civic leaders.
- Give women and girls visual variety and agency, not just background presence.
- Use clothing to communicate context and role subtly, not to label people as good or evil.
- Keep faces and silhouettes readable at tablet scale.

### Clothing vocabulary to research and use thoughtfully
- Babban riga and other regional robe forms.
- Kaftan-like garments where supported by the specific reference.
- Turbans and wrapped head coverings, with regional and role-specific variation.
- Embroidered necklines, chest panels and cuffs.
- Woven wrappers, veils and layered women's garments.
- Sandals, leather pouches, satchels and practical travel accessories.

Do not assume every Hausa or Fulani person wears the same garment. Avoid treating contemporary clothing as a precise historical reconstruction.

## 4. Visual language

**Rendering:** stylised realism / high-quality family adventure game.  
**Shapes:** soft bevels and readable silhouettes, with enough proportion realism to avoid toy-like caricature.  
**Materials:** sun-baked earth, lime or clay plaster, wood, leather, woven fibres, cotton, indigo-dyed cloth, brass, pottery and natural stone.  
**Lighting:** warm directional sunlight, soft bounce light, atmospheric dusk and clear night skies.  
**Composition:** layered foreground, midground and background; clear paths and landmarks; uncluttered interaction points.

### Initial palette

| Token | Hex | Use |
|---|---|---|
| Sahel sand | `#DDA45B` | sunlit earth, highlights |
| Clay | `#A95735` | walls, pottery, warm accents |
| Deep indigo | `#243F67` | textiles, night contrast |
| Forest green | `#315B45` | gardens, cloth accents |
| Date palm | `#6F7541` | vegetation, muted accents |
| Warm ivory | `#F2E4C8` | cloth, paper, interface surfaces |
| Dark umber | `#38271F` | wood, outlines, shadows |
| Brass | `#C99A43` | restrained ornament and hardware |
| Plum | `#713D5D` | selected textile accents |

Use colour with restraint. Avoid turning every garment into a highly saturated pattern.

## 5. Architecture and environments

For Hausa/Sahel-inspired worlds, research:
- Earthen compounds and courtyard houses.
- Decorated entrances and doors.
- Traditional mosque forms and minarets.
- Market streets, shaded stalls and craft workshops.
- Wells, granaries, storage spaces and caravan stops.
- Courtyards with shade trees and practical water features.

Use regionally grounded forms. Do not copy a famous building without understanding its context. Avoid making every settlement a palace or mosque; ordinary homes and working spaces make the world believable.

## 6. Religious representation

Islam should appear as lived practice and community life: learning, hospitality, prayer, trade ethics, family care and scholarship.

- Handle Qur'anic text with respect and verify every inscription.
- Do not generate pseudo-Arabic calligraphy or decorative fake Qur'anic verses.
- Avoid placing sacred text on floors, footwear, containers or other inappropriate surfaces.
- Do not use prophets as ordinary character models. For the Yusuf game, use environmental storytelling, point-of-view framing, symbolic objects and other characters' reactions rather than depicting Prophet Yusuf directly.
- Have religious content reviewed by knowledgeable people before release.

## 7. Technical asset principles

For eventual real-time 3D use:
- Prefer modular, reusable assets.
- Use consistent real-world scale and pivot conventions.
- Keep silhouettes readable on small screens.
- Use low-to-moderate polygon counts and level-of-detail variants where needed.
- Prefer baked lighting for static scenes where appropriate.
- Compress textures and provide mobile-friendly texture sizes.
- Keep materials simple and reuse shared texture atlases.
- Deliver source files plus documented exports (for example, Blender source and glTF/GLB runtime export).
- Include a lower-quality fallback or 2D alternative for constrained devices.

Do not promise Fire tablet performance until tested on the exact target hardware.

## 8. Accessibility and age range

- Strong contrast between interactive objects and their surroundings.
- Avoid relying on colour alone to communicate meaning.
- Readable facial expressions and object silhouettes.
- Large interaction targets.
- Avoid rapid flashing, excessive camera shake and compulsory timed challenges.
- Offer reduced motion and graphics-quality settings.
