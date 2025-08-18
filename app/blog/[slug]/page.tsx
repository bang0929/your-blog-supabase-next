export default async function BlogDetail({
  params
}: {
  params: Promise<{ slug: number | string }>
}) {
    const slug = (await params).slug;
    console.log(slug);

    return (
        <div>
            <h1>博客详情</h1>
        </div>
    )
}