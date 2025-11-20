import sys
# On s'assure que Python voit le dossier courant
import os
sys.path.append(os.getcwd())

try:
    import aqt
    sys.exit(aqt.run())
except Exception as e:
    print("CRASH AU DEMARRAGE :")
    print(e)
    import traceback
    traceback.print_exc()
    input("Appuie sur Entrée pour fermer...")