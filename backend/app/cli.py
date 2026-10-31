import click
from werkzeug.security import generate_password_hash

from app.database.db.session import get_session
from app.database.models.users import Role, User
from app.repositories.users_repository import UsersRepository


def register_cli(app):
    @app.cli.command("create-admin")
    @click.argument("email")
    @click.password_option(help="Ο κωδικός (θα σου ζητηθεί αν δεν τον δώσεις).")
    def create_admin(email, password):
        if len(password) < 8:
            raise click.ClickException("Password must be at least 8 characters.")

        session = get_session()
        if UsersRepository(session).get_by_email(email):
            raise click.ClickException(f"A user with email {email} already exists.")

        session.add(User(
            email=email,
            password_hash=generate_password_hash(password),
            role=Role.ADMIN,
            first_name="Admin",
        ))
        session.commit()
        click.echo(f"Admin {email} created.")
