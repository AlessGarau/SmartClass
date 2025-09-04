# TanStack Query

## Docs

[TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

## Install it

```bash
npm i @tanstack/react-query
```

### Wrap the app

Wrap l’app dans un **query client** 

Le **Query Client** est l'objet principal qui permet de gérer :

- Le **caching** (mise en cache) des données côté client
- Les **requêtes** asynchrones (fetching) et leur état (loading, success, error)
- La **mise à jour** automatique ou manuelle des données
- L'**invalidation** et la **refetch** des données
- Le partage des données entre différents composants

Il agit comme un layer intermédiaire entre ton app React et les datas venant du serveur.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryCLient } from "@tanstack/react-query";

const query = new QueryClient()

createRoot (document.getElementById ("root") !). render (
	<StrictMode>
		<QueryClientProvider client={queryCLient}>
				<App / >
		<QueryClientProvider/>
	</StrictMode>
);
```

## UseQuery

Prend 2 arguments :

- `queryKey: **Array**` → sert pour le *caching* et le *refetching.* Il faut donc que la clé soit unique sinon le queryClient ne fera pas la diff
- `queryFn: **Function`** → fonction utilisée pour récup la data de l’api

```tsx
import { useQuery } from "@tanstack/react-query";
import "./App.css";

function App() {

	const { data } = useQuery ({
		querykey: ['todos'],
		queryFn: getTodos
	})
	
	return (
		<>
			<div>something blah blah</div›
		</>
	); 
}

const getTodos = async () => {
	const response = await fetch ("https://jsonplaceholder.typicode.com/todos")
	return await response. json()
}

export default App;
```

On récupère `data` de `useQuery` ([lien vers return entier](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)). L’avantage c’est qu’on peut récupérer ce qu’on veut de `useQuery` (par exemple `isPending` → faire un chargement en attendant la data, ou `error` → traiter les erreurs).

## Query options

```tsx
const { data } = useQuery ({
	querykey: ['todos', id],
	queryFn: () => getTodos(id)
})

const getTodos = async (id: number) => {
	const response = await fetch ("https://jsonplaceholder.typicode.com/comments?postId=${id}")
	return await response. json()
}
```

Dans le cadre d’une requête dynamique (ex: **`GET** /comments?postId=1` ), il faut passer l’`id` dans le `queryKey` . Sinon le cache ne sera pas bien fait.

Il faut passer une fonction fléchée pour le `queryFn` . En effet, on ne veut pas appeler la fonction mais l’on veut la fournir à React Query pour que ça soit lui qui l’utilise.

## Conditional Query

```tsx
const [on, setOn] = useState(true)
const { data } = useQuery ({
	querykey: ['todos'],
	queryFn: getTodos
	enable: on
})
```

`enable` permet de lancer le fetch **uniquement** si `true` donc à chaque que le component se render le fetch n’est effectué que si `true` (en vrai si on force un refetch, ça relancera la query). 

## Reusable Query

## TypeSafety

```tsx
const getTodos = async (): Promise<Todo[]> => {
	const response = await fetch ("https://all-todos")
	return await response. json()
}
```

Bien typer le retour de la fonction de fetch permettra au `const { data } = useQuery({})` d’avoir le bon type. **ATTENTION →** si on essaie d’accéder à une property de data elle peut-être undefined 

### useSuspenseQuery

```tsx
const { data } = useSuspenseQuery ({
	querykey: ['todos'],
	queryFn: getTodos
	enable: on
})
```

`data` sera de type *`Todo[]`* et non plus de type `Todo[] | undefined` .

`useSuspenseQuery` est fait pour fonctionner avec `<Suspense>` de react.

```tsx
<Suspense fallback={<Loading/>}>
	<Card>
<Suspense/>
```

S’il y a une `suspenseQuery` n’importe ou dans le `<Suspense>` il va render le `fallback` tant que la query n’est pas resolve.

## Multiple Queries