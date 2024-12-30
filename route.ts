import { NextResponse } from 'next/server'

const moleculeUrls: Record<string, string> = {
  methane: 'https://raw.githubusercontent.com/3dmol/3Dmol.js/master/tests/auto/data/methane.sdf',
  ethanol: 'https://raw.githubusercontent.com/3dmol/3Dmol.js/master/tests/auto/data/ethanol.sdf',
  glucose: 'https://raw.githubusercontent.com/3dmol/3Dmol.js/master/tests/auto/data/glucose.sdf',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name || !moleculeUrls[name]) {
    return NextResponse.json({ error: 'Invalid molecule name' }, { status: 400 })
  }

  try {
    const response = await fetch(moleculeUrls[name])
    if (!response.ok) {
      throw new Error('Failed to fetch molecule data')
    }
    const data = await response.text()
    return new NextResponse(data, {
      headers: { 'Content-Type': 'chemical/x-mdl-sdfile' },
    })
  } catch (error) {
    console.error('Error fetching molecule data:', error)
    return NextResponse.json({ error: 'Failed to fetch molecule data' }, { status: 500 })
  }
}

