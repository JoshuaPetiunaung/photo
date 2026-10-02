import os
import shutil
from PIL import Image
import numpy as np
from scipy.ndimage import label

upload_dir = r'C:\Users\user\.gemini\antigravity-ide\brain\8ce3130f-81cc-4cc9-aefd-342a5593dfa5\.user_uploaded'
out_dir = r'c:\laragon\www\tes web\public\frames'
os.makedirs(out_dir, exist_ok=True)

# ==============================================================
# 1. Blue Ocean Fish Polaroids (3-Cut)
# ==============================================================
src1 = os.path.join(upload_dir, 'media_1790946684916.jpg')
shutil.copy(src1, os.path.join(out_dir, 'blue_ocean_fish_3cut.jpg'))
im1 = Image.open(src1).convert('RGBA')
arr1 = np.array(im1)
white1 = (arr1[:,:,0] > 250) & (arr1[:,:,1] > 250) & (arr1[:,:,2] > 250)
lab1, num1 = label(white1)
sizes1 = [(lab1 == i).sum() for i in range(1, num1+1)]
top3_ids = [i+1 for i in np.argsort(sizes1)[-3:]]
slot_mask1 = np.isin(lab1, top3_ids)
arr1[slot_mask1, 3] = 0
Image.fromarray(arr1).save(os.path.join(out_dir, 'blue_ocean_fish_3cut.png'))
print('1. blue_ocean_fish_3cut: OK (mask % =', f'{slot_mask1.mean()*100:.1f}%)')

# ==============================================================
# 2. Yellow Gingham Digicams (3-Cut)
# ==============================================================
src2 = os.path.join(upload_dir, 'media_1790946684975.jpg')
shutil.copy(src2, os.path.join(out_dir, 'yellow_gingham_digicam_3cut.jpg'))
im2 = Image.open(src2).convert('RGBA')
arr2 = np.array(im2)
# In yellow digicam, LCD screen pixels are grayscale > 175 inside the screen areas
slot_mask2 = np.zeros((1024, 576), dtype=bool)
for cy_est, cx_est in [(206, 244), (501, 248), (798, 253)]:
    box = arr2[cy_est-110:cy_est+110, cx_est-140:cx_est+140]
    local_screen = (box[:,:,0] > 175) & (box[:,:,1] > 175) & (box[:,:,2] > 175)
    lab, n = label(local_screen)
    center_val = lab[110, 140]
    comp = (lab == center_val)
    slot_mask2[cy_est-110:cy_est+110, cx_est-140:cx_est+140] |= comp

arr2[slot_mask2, 3] = 0
Image.fromarray(arr2).save(os.path.join(out_dir, 'yellow_gingham_digicam_3cut.png'))
print('2. yellow_gingham_digicam_3cut: OK (mask % =', f'{slot_mask2.mean()*100:.1f}%)')

# ==============================================================
# 3. Retro Switch Handheld Consoles (3-Cut)
# ==============================================================
src3 = os.path.join(upload_dir, 'media_1790946685086.jpg')
shutil.copy(src3, os.path.join(out_dir, 'retro_switch_consoles_3cut.jpg'))
im3 = Image.open(src3).convert('RGBA')
arr3 = np.array(im3)
slot_mask3 = np.zeros((1024, 576), dtype=bool)
for cy_est, cx_est in [(196, 290), (531, 288), (821, 290)]:
    box = arr3[cy_est-130:cy_est+130, cx_est-170:cx_est+170]
    local_screen = (box[:,:,0] > 240) & (box[:,:,1] > 240) & (box[:,:,2] > 240)
    lab, n = label(local_screen)
    center_val = lab[130, 170]
    comp = (lab == center_val)
    slot_mask3[cy_est-130:cy_est+130, cx_est-170:cx_est+170] |= comp

arr3[slot_mask3, 3] = 0
Image.fromarray(arr3).save(os.path.join(out_dir, 'retro_switch_consoles_3cut.png'))
print('3. retro_switch_consoles_3cut: OK (mask % =', f'{slot_mask3.mean()*100:.1f}%)')

# ==============================================================
# 4. Japanese Retro Red TV Pop Collage (3-Cut)
# ==============================================================
src4 = os.path.join(upload_dir, 'media_1790946685189.jpg')
shutil.copy(src4, os.path.join(out_dir, 'japanese_retro_tv_3cut.jpg'))
im4 = Image.open(src4).convert('RGBA')
arr4 = np.array(im4)
slot_mask4 = np.zeros((1024, 576), dtype=bool)
for cy_est, cx_est in [(215, 195), (519, 400), (848, 210)]:
    box = arr4[cy_est-135:cy_est+135, cx_est-155:cx_est+155]
    local_screen = (box[:,:,0] > 235) & (box[:,:,1] > 235) & (box[:,:,2] > 235)
    lab, n = label(local_screen)
    center_val = lab[135, 155]
    comp = (lab == center_val)
    slot_mask4[cy_est-135:cy_est+135, cx_est-155:cx_est+155] |= comp

arr4[slot_mask4, 3] = 0
Image.fromarray(arr4).save(os.path.join(out_dir, 'japanese_retro_tv_3cut.png'))
print('4. japanese_retro_tv_3cut: OK (mask % =', f'{slot_mask4.mean()*100:.1f}%)')

# ==============================================================
# 5. Polaroid OneStep Snoopy Burgundy (3-Cut)
# ==============================================================
src5 = os.path.join(upload_dir, 'media_1790946685193.jpg')
shutil.copy(src5, os.path.join(out_dir, 'polaroid_snoopy_burgundy_3cut.jpg'))
im5 = Image.open(src5).convert('RGBA')
arr5 = np.array(im5)
slot_mask5 = np.zeros((1024, 576), dtype=bool)
# 3 slots:
# Slot 1: x 185..412, y 273..448
# Slot 2: x 185..412, y 466..641
# Slot 3: x 185..412, y 660..835
for y1, y2 in [(273, 448), (466, 641), (660, 835)]:
    sub = arr5[y1:y2, 185:412]
    # In each slot, pixels with R > 240, G > 240, B > 240 are cut out
    # Colored stickers (Snoopy heart, Cupid bow, etc.) have lower values and stay opaque!
    sub_white = (sub[:,:,0] > 238) & (sub[:,:,1] > 238) & (sub[:,:,2] > 238)
    slot_mask5[y1:y2, 185:412] = sub_white

arr5[slot_mask5, 3] = 0
Image.fromarray(arr5).save(os.path.join(out_dir, 'polaroid_snoopy_burgundy_3cut.png'))
print('5. polaroid_snoopy_burgundy_3cut: OK (mask % =', f'{slot_mask5.mean()*100:.1f}%)')

print('ALL 5 FRAMES GENERATED SUCCESSFULLY!')
