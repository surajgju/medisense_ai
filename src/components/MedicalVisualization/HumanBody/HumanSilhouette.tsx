import React from 'react';

export const HumanSilhouette: React.FC = () => (
  <g aria-hidden="true">
    {/* Soft ambient core glow behind the torso */}
    <ellipse cx="190" cy="230" rx="108" ry="190" fill="url(#holoCoreAura)" />

    {/* Detailed anatomical outer body contour: cranium, jaw, neck, trapezius, deltoids, arms/hands, torso, hips, thighs, calves, ankles, feet */}
    <path
      d="
        M 190 16
        C 205 16, 215 26, 216 42
        C 217 48, 219 52, 218 57
        C 217 61, 215 62, 214 66
        C 213 73, 209 80, 203 84
        L 203 98
        C 208 103, 224 107, 240 112
        C 254 116, 261 124, 265 138
        L 277 188
        C 280 198, 284 212, 289 230
        L 297 262
        C 300 270, 306 278, 308 287
        C 309 294, 307 302, 303 305
        C 300 307, 297 304, 296 296
        L 293 286
        L 292 304
        C 291 309, 287 309, 286 303
        L 285 285
        L 282 303
        C 281 308, 277 308, 277 302
        L 277 284
        L 273 297
        C 272 301, 268 300, 269 294
        L 273 274
        C 274 268, 275 264, 273 257
        L 261 215
        C 257 202, 254 192, 251 178
        L 246 154
        C 244 166, 243 182, 240 198
        C 237 215, 234 228, 236 244
        C 239 262, 244 282, 243 304
        C 242 325, 239 354, 235 384
        C 233 398, 232 406, 232 418
        C 233 434, 234 452, 231 470
        C 228 486, 224 500, 224 514
        C 225 520, 231 526, 232 530
        C 232 534, 224 536, 214 535
        C 207 534, 204 528, 204 518
        C 204 502, 204 484, 201 464
        C 199 448, 198 430, 198 414
        C 198 394, 197 368, 195 344
        L 192 312
        L 190 310
        L 188 312
        L 185 344
        C 183 368, 182 394, 182 414
        C 182 430, 181 448, 179 464
        C 176 484, 176 502, 176 518
        C 176 528, 173 534, 166 535
        C 156 536, 148 534, 148 530
        C 149 526, 155 520, 156 514
        C 156 500, 152 486, 149 470
        C 146 452, 147 434, 148 418
        C 148 406, 147 398, 145 384
        C 141 354, 138 325, 137 304
        C 136 282, 141 262, 144 244
        C 146 228, 143 215, 140 198
        C 137 182, 136 166, 134 154
        L 129 178
        C 126 192, 123 202, 119 215
        L 107 257
        C 105 264, 106 268, 107 274
        L 111 294
        C 112 300, 108 301, 107 297
        L 103 284
        L 103 302
        C 103 308, 99 308, 98 303
        L 95 285
        L 94 303
        C 93 309, 89 309, 88 304
        L 87 286
        L 84 296
        C 83 304, 80 307, 77 305
        C 73 302, 71 294, 72 287
        C 74 278, 80 270, 83 262
        L 91 230
        C 96 212, 100 198, 103 188
        L 115 138
        C 119 124, 126 116, 140 112
        C 156 107, 172 103, 177 98
        L 177 84
        C 171 80, 167 73, 166 66
        C 165 62, 163 61, 162 57
        C 161 52, 163 48, 164 42
        C 165 26, 175 16, 190 16 Z
      "
      fill="url(#holoBodyFill)"
      stroke="url(#holoBodyEdge)"
      strokeWidth="1.5"
      filter="url(#holoCyanGlow)"
    />

    {/* Scanline surface texture clipped inside silhouette look */}
    <path
      d="
        M 190 18 C 204 18, 214 28, 214 44 C 214 64, 206 80, 201 84 L 201 100
        C 218 107, 250 115, 258 134 L 244 152 L 238 202 L 241 304 L 228 416 L 222 528 L 207 528
        L 199 412 L 190 308 L 181 412 L 173 528 L 158 528 L 152 416 L 139 304 L 142 202
        L 136 152 L 122 134 C 130 115, 162 107, 179 100 L 179 84 C 174 80, 166 64, 166 44
        C 166 28, 176 18, 190 18 Z
      "
      fill="url(#holoScanPattern)"
      opacity="0.7"
    />

    {/* Fine facial, neck, pectoral & muscular anatomical contour lines */}
    <g stroke="var(--holo-contour)" strokeOpacity="0.42" strokeWidth="0.85" fill="none">
      {/* Cranial brow, orbital sockets, nasal bridge, jawline */}
      <path d="M 171 45 Q 180 42 187 46 M 193 46 Q 200 42 209 45" strokeOpacity="0.55" />
      <ellipse cx="179" cy="50" rx="5.5" ry="3.2" strokeOpacity="0.45" />
      <ellipse cx="201" cy="50" rx="5.5" ry="3.2" strokeOpacity="0.45" />
      <path d="M 190 48 L 188 61 L 192 61" strokeOpacity="0.5" />
      <path d="M 183 68 Q 190 70 197 68" strokeOpacity="0.45" />
      <path d="M 169 62 Q 178 78 190 82 Q 202 78 211 62" strokeOpacity="0.5" />

      {/* Cervical sternocleidomastoid V-musculature */}
      <path d="M 177 85 L 188 112 M 203 85 L 192 112" strokeOpacity="0.42" />

      {/* Pectoral & abdominal anatomical muscle lines */}
      <path d="M 140 132 Q 164 146 187 142 M 240 132 Q 216 146 193 142" strokeOpacity="0.32" />
      <path d="M 165 186 Q 190 194 215 186" strokeOpacity="0.24" />
      <path d="M 176 218 Q 190 222 204 218 M 176 244 Q 190 248 204 244" strokeOpacity="0.2" />

      {/* Deltoid & bicep contour lines */}
      <path d="M 136 122 Q 123 138 124 156 M 244 122 Q 257 138 256 156" strokeOpacity="0.35" />
      {/* Quad & knee musculature */}
      <path d="M 152 332 Q 160 370 163 398 M 228 332 Q 220 370 217 398" strokeOpacity="0.28" />
    </g>
  </g>
);
