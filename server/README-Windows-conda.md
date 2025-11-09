Windows setup using conda (recommended)

This file contains the exact steps to install `pysam` (prebuilt from bioconda) and then install the rest of the Python dependencies in `server/requirements.txt`.

Prerequisites
- Install Anaconda or Miniconda (https://docs.conda.io/en/latest/miniconda.html) or Mambaforge (recommended for speed).
- Use an "Anaconda Prompt" or a command prompt where `conda` is initialized.

Quick steps (cmd.exe / Anaconda Prompt)

1) Create and activate a conda environment (Python 3.11 recommended):

```cmd
conda create -n mvapi python=3.11 -y
conda activate mvapi
```

2) Add channels (only needed once):

```cmd
conda config --add channels defaults
conda config --add channels conda-forge
conda config --add channels bioconda
```

3) Install `pysam` from bioconda (prebuilt wheel — avoids compiling on Windows):

```cmd
conda install -y pysam
```

If you'd like to use `mamba` (faster resolver), first install it then use it:

```cmd
conda install -n base -c conda-forge mamba -y
mamba install -y -c conda-forge -c bioconda pysam
```

4) Install the remaining Python packages from `server/requirements.txt` with pip:

```cmd
pip install -r server\requirements.txt
```

Notes
- Run these commands from your repository root (the folder that contains `server\requirements.txt`) or adjust the requirements path in the `pip install` command accordingly.
- If `pip` tries to build `pysam` again, the conda-installed package should still be used. If you see pip attempting to compile `pysam`, re-run the `pip install` step without `pysam` in the requirements file, or remove `pysam` temporarily from `requirements.txt` and re-add it later.
- If conda is not an option, see the project README for alternative instructions to install Visual C++ Build Tools + MSYS2, or use WSL/Ubuntu which typically works better for building bioinformatics packages.

If you want, run the provided batch script `server\scripts\setup_env.bat` from a conda-enabled command prompt (see script for details). After running, run your app (e.g., `uvicorn main:app --reload`) from inside the activated environment.