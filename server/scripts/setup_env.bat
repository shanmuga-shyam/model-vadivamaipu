@echo off
REM Setup script for Windows (cmd.exe / Anaconda Prompt)
REM Run this from the repository root or from a conda-enabled prompt.

REM 1) Create conda env
conda create -n mvapi python=3.11 -y

REM 2) Activate env (use Anaconda Prompt or run 'conda init cmd' first)
call conda activate mvapi

REM 3) Add channels
conda config --add channels defaults
conda config --add channels conda-forge
conda config --add channels bioconda

REM 4) Install pysam from bioconda
conda install -y pysam || (
  echo Failed to install pysam via conda. If conda install failed, try installing mamba then use mamba:
  echo    conda install -n base -c conda-forge mamba -y
  echo    mamba install -y -c conda-forge -c bioconda pysam
  exit /b 1
)

REM 5) Install the rest of requirements via pip
pip install -r server\requirements.txt

echo Setup finished. If any step failed, see README-Windows-conda.md for troubleshooting.