interface IPokemonDetailsPage {
    params: Promise<{ id: string }>;
}

export default async function PokemonDetailsPage({ params }: IPokemonDetailsPage) {
    const { id } = await params;

    return (
        <div>
            <p>Pokemon Id: {id}</p>
        </div>
    );
}
