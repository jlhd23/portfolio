FROM python:3.10

RUN pip install poetry
RUN poetry config virtualenvs.create false

WORKDIR /backend

COPY app/ ./app/
COPY poetry.lock ./
COPY pyproject.toml ./
COPY run.py ./
COPY start.sh ./

RUN poetry install --no-root

EXPOSE 3000

CMD ["sh", "./start.sh"]